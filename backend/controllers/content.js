import {
    HttpError,
    ensureEventExists,
    getBody,
    getId,
    getText,
    parseEventId,
    removeUpload,
    saveImage,
    sendSuccess,
    pool
} from "./dependencies.js";

export const listServices = async (request, response) => {
    const [data] = await pool.query("SELECT * FROM layanan ORDER BY id DESC");
    sendSuccess(response, null, { data });
};

export const createService = async (request, response) => {
    const { nama_layanan: namaLayanan, deskripsi } = getBody(request);
    const name = getText(namaLayanan);
    if (!name) throw new HttpError(400, "Nama layanan wajib diisi");
    if (name.length > 255 || Buffer.byteLength(getText(deskripsi)) > 65535) {
        throw new HttpError(400, "Data layanan melebihi batas panjang yang diizinkan");
    }

    const [result] = await pool.execute(
        "INSERT INTO layanan (nama_layanan, deskripsi) VALUES (?, ?)",
        [name, getText(deskripsi)]
    );
    sendSuccess(response, "Layanan berhasil ditambahkan", { id: result.insertId });
};

export const updateService = async (request, response) => {
    const { id: rawId, nama_layanan: namaLayanan, deskripsi } = getBody(request);
    const id = getId(rawId);
    const name = getText(namaLayanan);
    if (!id || !name) throw new HttpError(400, "ID dan nama layanan wajib diisi");
    if (name.length > 255 || Buffer.byteLength(getText(deskripsi)) > 65535) {
        throw new HttpError(400, "Data layanan melebihi batas panjang yang diizinkan");
    }

    const [existingServices] = await pool.execute("SELECT id FROM layanan WHERE id = ? LIMIT 1", [id]);
    if (existingServices.length === 0) throw new HttpError(404, "Layanan tidak ditemukan");

    await pool.execute(
        "UPDATE layanan SET nama_layanan = ?, deskripsi = ? WHERE id = ?",
        [name, getText(deskripsi), id]
    );
    sendSuccess(response, "Layanan berhasil diperbarui");
};

export const deleteService = async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID layanan wajib diisi");
    const [result] = await pool.execute("DELETE FROM layanan WHERE id = ?", [id]);
    if (result.affectedRows === 0) throw new HttpError(404, "Layanan tidak ditemukan");
    sendSuccess(response, "Layanan berhasil dihapus");
};

export const listGallery = async (request, response) => {
    const [data] = await pool.query("SELECT * FROM galeri ORDER BY id DESC");
    sendSuccess(response, null, { data });
};

export const createGallery = async (request, response) => {
    const { judul, deskripsi } = getBody(request);
    const title = getText(judul);
    if (!title) throw new HttpError(400, "Judul galeri wajib diisi");
    if (title.length > 255 || Buffer.byteLength(getText(deskripsi)) > 65535) {
        throw new HttpError(400, "Data galeri melebihi batas panjang yang diizinkan");
    }

    const eventId = parseEventId(request.body?.event_id);
    await ensureEventExists(eventId);
    const fileName = await saveImage(request.file);

    try {
        await pool.execute(
            "INSERT INTO galeri (judul, gambar, deskripsi, event_id) VALUES (?, ?, ?, ?)",
            [title, fileName, getText(deskripsi), eventId]
        );
    } catch (error) {
        await removeUpload(fileName);
        throw error;
    }

    sendSuccess(response, "Galeri berhasil ditambahkan");
};

export const updateGallery = async (request, response) => {
    const { id: rawId, judul, deskripsi } = getBody(request);
    const id = getId(rawId);
    const title = getText(judul);
    if (!id || !title) throw new HttpError(400, "Data tidak lengkap");
    if (title.length > 255 || Buffer.byteLength(getText(deskripsi)) > 65535) {
        throw new HttpError(400, "Data galeri melebihi batas panjang yang diizinkan");
    }

    const eventId = parseEventId(request.body?.event_id);
    await ensureEventExists(eventId);
    const [rows] = await pool.execute("SELECT gambar FROM galeri WHERE id = ?", [id]);
    if (rows.length === 0) throw new HttpError(404, "Data galeri tidak ditemukan");

    const oldFileName = rows[0].gambar;
    const newFileName = request.file ? await saveImage(request.file) : oldFileName;

    try {
        await pool.execute(
            "UPDATE galeri SET judul = ?, gambar = ?, deskripsi = ?, event_id = ? WHERE id = ?",
            [title, newFileName, getText(deskripsi), eventId, id]
        );
    } catch (error) {
        if (newFileName !== oldFileName) await removeUpload(newFileName);
        throw error;
    }

    if (newFileName !== oldFileName) await removeUpload(oldFileName);
    sendSuccess(response, "Galeri berhasil diperbarui");
};

export const deleteGallery = async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID tidak valid");

    const [rows] = await pool.execute("SELECT gambar FROM galeri WHERE id = ?", [id]);
    if (rows.length === 0) throw new HttpError(404, "Data galeri tidak ditemukan");
    await pool.execute("DELETE FROM galeri WHERE id = ?", [id]);
    await removeUpload(rows[0].gambar);
    sendSuccess(response, "Galeri berhasil dihapus");
};

export const createContact = async (request, response) => {
    const { nama, email, no_hp: noHp, pesan } = getBody(request);
    const name = getText(nama);
    const address = getText(email);
    const message = getText(pesan);

    if (!name || !address || !message) {
        throw new HttpError(400, "Nama, email, dan pesan wajib diisi");
    }
    if (name.length > 255 || address.length > 254 || getText(noHp).length > 50 || Buffer.byteLength(message) > 65535) {
        throw new HttpError(400, "Data kontak melebihi batas panjang yang diizinkan");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new HttpError(400, "Format email tidak valid");
    }

    await pool.execute(
        "INSERT INTO kontak (nama, email, no_hp, pesan) VALUES (?, ?, ?, ?)",
        [name, address, getText(noHp), message]
    );
    sendSuccess(response, "Pesan berhasil dikirim");
};

export const listContacts = async (request, response) => {
    const [data] = await pool.query(
        "SELECT id, nama, email, no_hp, pesan, created_at FROM kontak ORDER BY created_at DESC, id DESC"
    );
    sendSuccess(response, null, { data });
};

export const deleteContact = async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID pesan kontak wajib diisi");

    const [result] = await pool.execute("DELETE FROM kontak WHERE id = ?", [id]);
    if (result.affectedRows === 0) throw new HttpError(404, "Pesan kontak tidak ditemukan");
    sendSuccess(response, "Pesan kontak berhasil dihapus");
};
