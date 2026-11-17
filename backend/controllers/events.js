import {
    HttpError,
    ensureEventAccess,
    getBody,
    getId,
    getListPaginationParams,
    getListPaginationSql,
    getText,
    parseListFilter,
    parseListPagination,
    sendListSuccess,
    sendSuccess,
    pool
} from "./dependencies.js";

export const listEvents = async (request, response) => {
    const pagination = parseListPagination(request.query);
    const search = parseListFilter(request.query, "q", 255);
    const category = parseListFilter(request.query, "kategori", 100);
    const date = parseListFilter(request.query, "tanggal", 32);
    const conditions = [];
    const filterParams = [];

    if (search) {
        conditions.push("(nama_event LIKE ? OR lokasi LIKE ? OR kategori LIKE ? OR label LIKE ? OR produksi LIKE ?)");
        const searchTerm = `%${search}%`;
        filterParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    if (category) {
        conditions.push("kategori = ?");
        filterParams.push(category);
    }
    if (date) {
        conditions.push("tanggal = ?");
        filterParams.push(date);
    }
    const filterSql = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const [counts] = await pool.execute(`SELECT COUNT(*) AS total FROM events ${filterSql}`, filterParams);
    const [events] = await pool.execute(
        `SELECT * FROM events ${filterSql}
         ORDER BY tanggal DESC, id DESC${getListPaginationSql(pagination)}`,
        [...filterParams, ...getListPaginationParams(pagination)]
    );
    const eventIds = events.map((event) => event.id);
    let photos = [];
    if (eventIds.length > 0) {
        const eventPlaceholders = eventIds.map(() => "?").join(", ");
        [photos] = await pool.execute(
            `SELECT id, event_id, judul, gambar, deskripsi
             FROM galeri WHERE event_id IN (${eventPlaceholders}) ORDER BY id ASC`,
            eventIds
        );
    }
    const photosByEvent = new Map();

    for (const photo of photos) {
        const key = String(photo.event_id);
        photosByEvent.set(key, [...(photosByEvent.get(key) ?? []), photo]);
    }

    sendListSuccess(
        response,
        events.map((event) => ({
            ...event,
            galeri: photosByEvent.get(String(event.id)) ?? []
        })),
        Number(counts[0].total),
        pagination
    );
};

export const createEvent = async (request, response) => {
    const { nama_event: namaEvent, tanggal, lokasi, deskripsi } = getBody(request);
    const name = getText(namaEvent);
    const eventDate = getText(tanggal);
    const location = getText(lokasi);
    const description = getText(deskripsi);

    if (!name || !eventDate) {
        throw new HttpError(400, "Nama event dan tanggal wajib diisi");
    }
    if (name.length > 255 || eventDate.length > 32 || location.length > 255 || Buffer.byteLength(description) > 65535) {
        throw new HttpError(400, "Data event melebihi batas panjang yang diizinkan");
    }

    const [result] = await pool.execute(
        "INSERT INTO events (nama_event, tanggal, lokasi, deskripsi, created_by) VALUES (?, ?, ?, ?, ?)",
        [name, eventDate, location, description, request.userId]
    );
    sendSuccess(response, "Event berhasil ditambahkan", { id: result.insertId });
};

export const updateEvent = async (request, response) => {
    const { id: rawId, nama_event: namaEvent, tanggal, lokasi, deskripsi } = getBody(request);
    const id = getId(rawId);
    const name = getText(namaEvent);
    const eventDate = getText(tanggal);
    const location = getText(lokasi);
    const description = getText(deskripsi);

    if (!id || !name || !eventDate) {
        throw new HttpError(400, "ID, nama event, dan tanggal wajib diisi");
    }
    if (name.length > 255 || eventDate.length > 32 || location.length > 255 || Buffer.byteLength(description) > 65535) {
        throw new HttpError(400, "Data event melebihi batas panjang yang diizinkan");
    }

    await ensureEventAccess(id, request.userId, request.userRole);

    await pool.execute(
        "UPDATE events SET nama_event = ?, tanggal = ?, lokasi = ?, deskripsi = ? WHERE id = ?",
        [name, eventDate, location, description, id]
    );
    sendSuccess(response, "Event berhasil diperbarui");
};

export const deleteEvent = async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID event wajib diisi");
    await ensureEventAccess(id, request.userId, request.userRole);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute("UPDATE galeri SET event_id = NULL WHERE event_id = ?", [id]);
        const [result] = await connection.execute("DELETE FROM events WHERE id = ?", [id]);
        if (result.affectedRows === 0) throw new HttpError(404, "Event tidak ditemukan");
        await connection.commit();
    } catch (error) {
        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Failed to roll back event deletion:", rollbackError);
        }
        throw error;
    } finally {
        connection.release();
    }

    sendSuccess(response, "Event berhasil dihapus");
};
