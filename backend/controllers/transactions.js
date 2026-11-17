import {
    HttpError,
    calculateInvoiceTotal,
    getBody,
    getId,
    getListPaginationParams,
    getListPaginationSql,
    getText,
    parseListFilter,
    parseListIdFilter,
    parseListPagination,
    sendListSuccess,
    sendSuccess,
    pool
} from "./dependencies.js";

export const createTransaction = async (request, response) => {
    const { pendaftaran_id: rawRegistrationId, metode: rawMethod } = getBody(request);
    const registrationId = getId(rawRegistrationId);
    const method = getText(rawMethod);
    if (!registrationId || !method) {
        throw new HttpError(400, "ID pendaftaran dan metode pembayaran wajib diisi");
    }
    if (method.length > 100) {
        throw new HttpError(400, "Metode pembayaran maksimal 100 karakter");
    }

    const connection = await pool.getConnection();
    let total;
    let transactionId;
    try {
        await connection.beginTransaction();

        const [registrations] = await connection.execute(
            `SELECT id, tiket_id, jumlah, status
             FROM pendaftaran
             WHERE id = ? AND user_id = ?
             LIMIT 1
             FOR UPDATE`,
            [registrationId, request.userId]
        );
        if (registrations.length === 0) throw new HttpError(404, "Pendaftaran tidak ditemukan");
        const registration = registrations[0];
        if (registration.status !== "pending") {
            throw new HttpError(409, "Tagihan hanya dapat dibuat untuk pendaftaran pending");
        }

        const [existingTransactions] = await connection.execute(
            `SELECT id, status
             FROM transaksi
             WHERE pendaftaran_id = ? AND status IN ('pending', 'paid')
             ORDER BY id DESC
             LIMIT 1
             FOR UPDATE`,
            [registrationId]
        );
        if (existingTransactions.length > 0) {
            const existing = existingTransactions[0];
            throw new HttpError(
                409,
                existing.status === "paid"
                    ? "Pendaftaran ini sudah dibayar"
                    : "Tagihan untuk pendaftaran ini masih pending"
            );
        }

        const [tickets] = await connection.execute(
            "SELECT harga FROM tiket WHERE id = ? FOR UPDATE",
            [registration.tiket_id]
        );
        if (tickets.length === 0) throw new HttpError(404, "Tiket pendaftaran tidak ditemukan");
        total = calculateInvoiceTotal(tickets[0].harga, registration.jumlah);

        const [result] = await connection.execute(
            "INSERT INTO transaksi (pendaftaran_id, total, metode, status) VALUES (?, ?, ?, 'pending')",
            [registrationId, total, method]
        );
        transactionId = result.insertId;
        await connection.commit();
    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Failed to roll back invoice creation:", rollbackError);
        }
        throw error;
    } finally {
        connection.release();
    }

    response.status(201);
    sendSuccess(response, "Tagihan berhasil dibuat", {
        data: {
            id: transactionId,
            pendaftaran_id: registrationId,
            total,
            metode: method,
            status: "pending",
            paid_at: null
        }
    });
};

export const listMyTransactions = async (request, response) => {
    const pagination = parseListPagination(request.query);
    const status = parseListFilter(request.query, "status", 20);
    const eventId = parseListIdFilter(request.query, "event_id");
    if (status && !["pending", "paid", "failed"].includes(status)) {
        throw new HttpError(400, "Filter status tidak valid");
    }

    const conditions = ["p.user_id = ?"];
    const filterParams = [request.userId];
    if (status) {
        conditions.push("t.status = ?");
        filterParams.push(status);
    }
    if (eventId) {
        conditions.push("p.event_id = ?");
        filterParams.push(eventId);
    }
    const filterSql = `WHERE ${conditions.join(" AND ")}`;
    const [counts] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM transaksi t
         JOIN pendaftaran p ON p.id = t.pendaftaran_id
         ${filterSql}`,
        filterParams
    );
    const [data] = await pool.execute(
        `SELECT t.id, t.pendaftaran_id, p.event_id, e.nama_event,
                p.tiket_id, tk.nama_tiket, p.jumlah, t.total, t.metode, t.status,
                t.paid_at, p.status AS pendaftaran_status, p.created_at AS pendaftaran_created_at
         FROM transaksi t
         JOIN pendaftaran p ON p.id = t.pendaftaran_id
         JOIN events e ON e.id = p.event_id
         JOIN tiket tk ON tk.id = p.tiket_id
         ${filterSql}
         ORDER BY t.id DESC${getListPaginationSql(pagination)}`,
        [...filterParams, ...getListPaginationParams(pagination)]
    );
    sendListSuccess(response, data, Number(counts[0].total), pagination);
};

export const getTransactionRecap = async (request, response) => {
    const pagination = parseListPagination(request.query);
    const eventId = parseListIdFilter(request.query, "event_id");
    const status = parseListFilter(request.query, "status", 20);
    if (status && !["pending", "paid", "failed"].includes(status)) {
        throw new HttpError(400, "Filter status tidak valid");
    }

    const conditions = [];
    const filterParams = [];
    if (request.userRole === "panitia") {
        conditions.push("e.created_by = ?");
        filterParams.push(request.userId);
    }
    if (eventId) {
        conditions.push("e.id = ?");
        filterParams.push(eventId);
    }
    if (status) {
        conditions.push("t.status = ?");
        filterParams.push(status);
    }
    const filterSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const [counts] = await pool.execute(
        `SELECT COUNT(DISTINCT e.id) AS total
         FROM events e
         LEFT JOIN pendaftaran p ON p.event_id = e.id
         LEFT JOIN transaksi t ON t.pendaftaran_id = p.id
         ${filterSql}`,
        filterParams
    );
    const [data] = await pool.execute(
        `SELECT e.id AS event_id, e.nama_event,
                COUNT(t.id) AS jumlah_transaksi,
                SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
                SUM(CASE WHEN t.status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
                SUM(CASE WHEN t.status = 'failed' THEN 1 ELSE 0 END) AS failed_count,
                COALESCE(SUM(CASE WHEN t.status = 'pending' THEN t.total ELSE 0 END), 0.00) AS pending_total,
                COALESCE(SUM(CASE WHEN t.status = 'paid' THEN t.total ELSE 0 END), 0.00) AS paid_total,
                COALESCE(SUM(CASE WHEN t.status = 'failed' THEN t.total ELSE 0 END), 0.00) AS failed_total
         FROM events e
         LEFT JOIN pendaftaran p ON p.event_id = e.id
         LEFT JOIN transaksi t ON t.pendaftaran_id = p.id
         ${filterSql}
         GROUP BY e.id, e.nama_event
         ORDER BY e.id DESC${getListPaginationSql(pagination)}`,
        [...filterParams, ...getListPaginationParams(pagination)]
    );
    sendListSuccess(response, data, Number(counts[0].total), pagination);
};

export const confirmTransaction = async (request, response) => {
    const transactionId = getId(request.params.id);
    if (!transactionId) throw new HttpError(400, "ID transaksi tidak valid");

    const connection = await pool.getConnection();
    let alreadyConfirmed = false;
    try {
        await connection.beginTransaction();

        const [transactionRefs] = await connection.execute(
            "SELECT pendaftaran_id FROM transaksi WHERE id = ? LIMIT 1",
            [transactionId]
        );
        if (transactionRefs.length === 0) throw new HttpError(404, "Transaksi tidak ditemukan");
        const registrationId = transactionRefs[0].pendaftaran_id;

        const [registrations] = await connection.execute(
            "SELECT id, status FROM pendaftaran WHERE id = ? LIMIT 1 FOR UPDATE",
            [registrationId]
        );
        if (registrations.length === 0) throw new HttpError(404, "Pendaftaran transaksi tidak ditemukan");

        const [transactions] = await connection.execute(
            "SELECT id, status FROM transaksi WHERE id = ? AND pendaftaran_id = ? LIMIT 1 FOR UPDATE",
            [transactionId, registrationId]
        );
        if (transactions.length === 0) throw new HttpError(404, "Transaksi tidak ditemukan");

        const transaction = transactions[0];
        const registration = registrations[0];
        if (transaction.status === "paid" && registration.status === "confirmed") {
            alreadyConfirmed = true;
        } else {
            if (transaction.status !== "pending") {
                throw new HttpError(409, "Hanya transaksi pending yang dapat dikonfirmasi");
            }
            if (registration.status !== "pending") {
                throw new HttpError(409, "Pendaftaran tidak lagi berstatus pending");
            }

            const [transactionUpdate] = await connection.execute(
                "UPDATE transaksi SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'",
                [transactionId]
            );
            if (transactionUpdate.affectedRows === 0) {
                throw new HttpError(409, "Transaksi tidak lagi dapat dikonfirmasi");
            }

            const [registrationUpdate] = await connection.execute(
                "UPDATE pendaftaran SET status = 'confirmed' WHERE id = ? AND status = 'pending'",
                [registrationId]
            );
            if (registrationUpdate.affectedRows === 0) {
                throw new HttpError(409, "Pendaftaran tidak lagi dapat dikonfirmasi");
            }
        }

        await connection.commit();
    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Failed to roll back transaction confirmation:", rollbackError);
        }
        throw error;
    } finally {
        connection.release();
    }

    sendSuccess(response, alreadyConfirmed ? "Transaksi sudah dikonfirmasi" : "Transaksi berhasil dikonfirmasi", {
        data: { id: transactionId, status: "paid", pendaftaran_status: "confirmed" }
    });
};
