import {
    HttpError,
    ensureEventAccess,
    getBody,
    getId,
    getListPaginationParams,
    getListPaginationSql,
    parseListFilter,
    parseListIdFilter,
    parseListPagination,
    parsePositiveUnsignedInt,
    sendListSuccess,
    sendSuccess,
    pool
} from "./dependencies.js";

export const createRegistration = async (request, response) => {
    const { tiket_id: rawTicketId, jumlah: rawQuantity } = getBody(request);
    const ticketId = getId(rawTicketId);
    if (!ticketId) throw new HttpError(400, "ID tiket wajib diisi");
    const quantity = parsePositiveUnsignedInt(rawQuantity, "Jumlah");

    const connection = await pool.getConnection();
    let registrationId;
    let eventId;
    try {
        await connection.beginTransaction();

        const [tickets] = await connection.execute(
            "SELECT id, event_id FROM tiket WHERE id = ? FOR UPDATE",
            [ticketId]
        );
        if (tickets.length === 0) throw new HttpError(404, "Tiket tidak ditemukan");

        const ticket = tickets[0];
        eventId = ticket.event_id;
        const [result] = await connection.execute(
            `UPDATE tiket
             SET terjual = terjual + ?
             WHERE id = ? AND terjual + ? <= kuota`,
            [quantity, ticketId, quantity]
        );
        if (result.affectedRows === 0) {
            throw new HttpError(409, "Sisa kuota tiket tidak mencukupi");
        }

        const [registration] = await connection.execute(
            "INSERT INTO pendaftaran (user_id, event_id, tiket_id, jumlah) VALUES (?, ?, ?, ?)",
            [request.userId, ticket.event_id, ticketId, quantity]
        );
        registrationId = registration.insertId;
        await connection.commit();
    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Failed to roll back registration:", rollbackError);
        }
        throw error;
    } finally {
        connection.release();
    }

    response.status(201);
    sendSuccess(response, "Pendaftaran berhasil dibuat", {
        data: { id: registrationId, event_id: eventId, tiket_id: ticketId, jumlah: quantity, status: "pending" }
    });
};

export const listMyRegistrations = async (request, response) => {
    const pagination = parseListPagination(request.query);
    const status = parseListFilter(request.query, "status", 20);
    const eventId = parseListIdFilter(request.query, "event_id");
    if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
        throw new HttpError(400, "Filter status tidak valid");
    }

    const conditions = ["p.user_id = ?"];
    const filterParams = [request.userId];
    if (status) {
        conditions.push("p.status = ?");
        filterParams.push(status);
    }
    if (eventId) {
        conditions.push("p.event_id = ?");
        filterParams.push(eventId);
    }
    const filterSql = `WHERE ${conditions.join(" AND ")}`;
    const [counts] = await pool.execute(
        `SELECT COUNT(*) AS total FROM pendaftaran p ${filterSql}`,
        filterParams
    );
    const [data] = await pool.execute(
        `SELECT p.id, p.event_id, e.nama_event, e.tanggal, p.tiket_id, t.nama_tiket,
                p.jumlah, p.status, p.created_at
         FROM pendaftaran p
         JOIN events e ON e.id = p.event_id
         JOIN tiket t ON t.id = p.tiket_id
         ${filterSql}
         ORDER BY p.created_at DESC, p.id DESC${getListPaginationSql(pagination)}`,
        [...filterParams, ...getListPaginationParams(pagination)]
    );
    sendListSuccess(response, data, Number(counts[0].total), pagination);
};

export const cancelRegistration = async (request, response) => {
    const registrationId = getId(request.params.id);
    if (!registrationId) throw new HttpError(400, "ID pendaftaran tidak valid");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT id, tiket_id, jumlah, status
             FROM pendaftaran
             WHERE id = ? AND user_id = ?
             LIMIT 1
             FOR UPDATE`,
            [registrationId, request.userId]
        );
        if (rows.length === 0) throw new HttpError(404, "Pendaftaran tidak ditemukan");
        const registration = rows[0];
        if (registration.status !== "pending") {
            throw new HttpError(409, "Hanya pendaftaran pending yang dapat dibatalkan");
        }

        const [ticketUpdate] = await connection.execute(
            "UPDATE tiket SET terjual = terjual - ? WHERE id = ? AND terjual >= ?",
            [registration.jumlah, registration.tiket_id, registration.jumlah]
        );
        if (ticketUpdate.affectedRows === 0) {
            throw new HttpError(409, "Kuota tiket tidak dapat dikembalikan");
        }

        const [registrationUpdate] = await connection.execute(
            "UPDATE pendaftaran SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'pending'",
            [registrationId, request.userId]
        );
        if (registrationUpdate.affectedRows === 0) {
            throw new HttpError(409, "Pendaftaran tidak lagi dapat dibatalkan");
        }

        await connection.commit();
    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Failed to roll back registration cancellation:", rollbackError);
        }
        throw error;
    } finally {
        connection.release();
    }

    sendSuccess(response, "Pendaftaran berhasil dibatalkan", {
        data: { id: registrationId, status: "cancelled" }
    });
};

export const listEventRegistrations = async (request, response) => {
    const eventId = getId(request.params.eventId);
    if (!eventId) throw new HttpError(400, "ID event tidak valid");
    await ensureEventAccess(eventId, request.userId, request.userRole);

    const pagination = parseListPagination(request.query);
    const status = parseListFilter(request.query, "status", 20);
    const search = parseListFilter(request.query, "q", 255);
    if (status && !["pending", "confirmed", "cancelled"].includes(status)) {
        throw new HttpError(400, "Filter status tidak valid");
    }

    const conditions = ["p.event_id = ?"];
    const filterParams = [eventId];
    if (status) {
        conditions.push("p.status = ?");
        filterParams.push(status);
    }
    if (search) {
        conditions.push("(u.nama LIKE ? OR u.email LIKE ?)");
        filterParams.push(`%${search}%`, `%${search}%`);
    }
    const filterSql = `WHERE ${conditions.join(" AND ")}`;
    const [counts] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM pendaftaran p
         JOIN users u ON u.id = p.user_id
         ${filterSql}`,
        filterParams
    );
    const [data] = await pool.execute(
        `SELECT p.id, p.user_id, u.nama AS nama_peserta, u.email AS email_peserta,
                p.tiket_id, t.nama_tiket, p.jumlah, p.status, p.created_at
         FROM pendaftaran p
         JOIN users u ON u.id = p.user_id
         JOIN tiket t ON t.id = p.tiket_id
         ${filterSql}
         ORDER BY p.created_at ASC, p.id ASC${getListPaginationSql(pagination)}`,
        [...filterParams, ...getListPaginationParams(pagination)]
    );
    sendListSuccess(response, data, Number(counts[0].total), pagination);
};
