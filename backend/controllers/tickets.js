import {
    HttpError,
    ensureEventAccess,
    getBody,
    getId,
    getText,
    parsePositiveUnsignedInt,
    parseTicketPrice,
    sendSuccess,
    pool
} from "./dependencies.js";

export const listEventTickets = async (request, response) => {
    const eventId = getId(request.params.eventId);
    if (!eventId) throw new HttpError(400, "ID event tidak valid");

    await ensureEventAccess(eventId, request.userId, request.userRole);

    const [data] = await pool.execute(
        `SELECT id, event_id, nama_tiket, harga, kuota, terjual,
                CAST(kuota AS SIGNED) - CAST(terjual AS SIGNED) AS sisa_kuota
         FROM tiket WHERE event_id = ? ORDER BY id ASC`,
        [eventId]
    );
    sendSuccess(response, null, { data });
};

export const createEventTicket = async (request, response) => {
    const eventId = getId(request.params.eventId);
    if (!eventId) throw new HttpError(400, "ID event tidak valid");

    await ensureEventAccess(eventId, request.userId, request.userRole);

    const { nama_tiket: rawName, harga, kuota } = getBody(request);
    const name = getText(rawName);
    if (!name || name.length > 255) {
        throw new HttpError(400, "Nama tiket wajib diisi dan maksimal 255 karakter");
    }
    const price = parseTicketPrice(harga);
    const quota = parsePositiveUnsignedInt(kuota, "Kuota tiket");

    const [result] = await pool.execute(
        "INSERT INTO tiket (event_id, nama_tiket, harga, kuota) VALUES (?, ?, ?, ?)",
        [eventId, name, price, quota]
    );
    response.status(201);
    sendSuccess(response, "Tiket berhasil ditambahkan", { id: result.insertId });
};

export const updateEventTicket = async (request, response) => {
    const eventId = getId(request.params.eventId);
    const ticketId = getId(request.params.tiketId);
    if (!eventId || !ticketId) throw new HttpError(400, "ID event atau tiket tidak valid");
    await ensureEventAccess(eventId, request.userId, request.userRole);

    const { nama_tiket: rawName, harga, kuota } = getBody(request);
    const name = getText(rawName);
    if (!name || name.length > 255) {
        throw new HttpError(400, "Nama tiket wajib diisi dan maksimal 255 karakter");
    }
    const price = parseTicketPrice(harga);
    const quota = parsePositiveUnsignedInt(kuota, "Kuota tiket");

    const [tickets] = await pool.execute(
        "SELECT id, terjual FROM tiket WHERE id = ? AND event_id = ? LIMIT 1",
        [ticketId, eventId]
    );
    if (tickets.length === 0) throw new HttpError(404, "Tiket tidak ditemukan untuk event ini");
    if (quota < Number(tickets[0].terjual)) {
        throw new HttpError(409, "Kuota tidak boleh kurang dari jumlah tiket terjual");
    }

    await pool.execute(
        "UPDATE tiket SET nama_tiket = ?, harga = ?, kuota = ? WHERE id = ? AND event_id = ?",
        [name, price, quota, ticketId, eventId]
    );
    sendSuccess(response, "Tiket berhasil diperbarui");
};

export const deleteEventTicket = async (request, response) => {
    const eventId = getId(request.params.eventId);
    const ticketId = getId(request.params.tiketId);
    if (!eventId || !ticketId) throw new HttpError(400, "ID event atau tiket tidak valid");
    await ensureEventAccess(eventId, request.userId, request.userRole);

    const [tickets] = await pool.execute(
        "SELECT id, terjual FROM tiket WHERE id = ? AND event_id = ? LIMIT 1",
        [ticketId, eventId]
    );
    if (tickets.length === 0) throw new HttpError(404, "Tiket tidak ditemukan untuk event ini");
    if (Number(tickets[0].terjual) > 0) {
        throw new HttpError(409, "Tiket yang sudah terjual tidak dapat dihapus");
    }

    try {
        await pool.execute("DELETE FROM tiket WHERE id = ? AND event_id = ?", [ticketId, eventId]);
    } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            throw new HttpError(409, "Tiket yang sudah memiliki pendaftaran tidak dapat dihapus");
        }
        throw error;
    }
    sendSuccess(response, "Tiket berhasil dihapus");
};
