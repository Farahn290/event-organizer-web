import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import pool from "./src/database.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
const port = Number(process.env.PORT || 8000);
const uploadsDirectory = fileURLToPath(new URL("./uploads/", import.meta.url));
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const getBody = (request) => (
    request.body && typeof request.body === "object" && !Array.isArray(request.body)
        ? request.body
        : {}
);

const getText = (value) => (typeof value === "string" ? value.trim() : "");

const getId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const sendSuccess = (response, message, data = {}) => {
    response.json({ success: true, ...(message ? { message } : {}), ...data });
};

const removeUpload = async (fileName) => {
    if (!fileName) return;

    try {
        await rm(path.join(uploadsDirectory, path.basename(fileName)), { force: true });
    } catch (error) {
        console.error("Failed to remove uploaded image:", error);
    }
};

const getImageExtension = (buffer) => {
    if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "jpg";
    if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        return "png";
    }
    if (
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
        return "webp";
    }
    return null;
};

const parseEventId = (value) => {
    if (value === undefined || value === "") return null;
    const eventId = getId(value);
    if (!eventId) throw new HttpError(400, "Event yang dipilih tidak valid");
    return eventId;
};

const ensureEventExists = async (eventId) => {
    if (eventId === null) return;
    const [rows] = await pool.execute("SELECT id FROM events WHERE id = ? LIMIT 1", [eventId]);
    if (rows.length === 0) throw new HttpError(400, "Event yang dipilih tidak ditemukan");
};

const saveImage = async (file) => {
    if (!file) throw new HttpError(400, "Gambar wajib dipilih");
    const extension = getImageExtension(file.buffer);
    if (!extension) throw new HttpError(400, "Format gambar harus JPG, PNG, atau WEBP");

    const fileName = `galeri_${randomUUID()}.${extension}`;
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(uploadsDirectory, fileName), file.buffer, { flag: "wx" });
    return fileName;
};

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadsDirectory));

app.get("/api/health", async (request, response) => {
    await pool.query("SELECT 1");
    sendSuccess(response, "Backend Node.js aktif");
});

app.get("/api/events", async (request, response) => {
    const [events] = await pool.query("SELECT * FROM events ORDER BY tanggal DESC, id DESC");
    const [photos] = await pool.query(
        "SELECT id, event_id, judul, gambar, deskripsi FROM galeri WHERE event_id IS NOT NULL ORDER BY id ASC"
    );
    const photosByEvent = new Map();

    for (const photo of photos) {
        const key = String(photo.event_id);
        photosByEvent.set(key, [...(photosByEvent.get(key) ?? []), photo]);
    }

    sendSuccess(response, null, {
        data: events.map((event) => ({
            ...event,
            galeri: photosByEvent.get(String(event.id)) ?? []
        }))
    });
});

app.post("/api/events/create", async (request, response) => {
    const { nama_event: namaEvent, tanggal, lokasi, deskripsi } = getBody(request);
    const name = getText(namaEvent);
    const eventDate = getText(tanggal);

    if (!name || !eventDate) {
        throw new HttpError(400, "Nama event dan tanggal wajib diisi");
    }

    const [result] = await pool.execute(
        "INSERT INTO events (nama_event, tanggal, lokasi, deskripsi) VALUES (?, ?, ?, ?)",
        [name, eventDate, getText(lokasi), getText(deskripsi)]
    );
    sendSuccess(response, "Event berhasil ditambahkan", { id: result.insertId });
});

app.put("/api/events/update", async (request, response) => {
    const { id: rawId, nama_event: namaEvent, tanggal, lokasi, deskripsi } = getBody(request);
    const id = getId(rawId);
    const name = getText(namaEvent);
    const eventDate = getText(tanggal);

    if (!id || !name || !eventDate) {
        throw new HttpError(400, "ID, nama event, dan tanggal wajib diisi");
    }

    await pool.execute(
        "UPDATE events SET nama_event = ?, tanggal = ?, lokasi = ?, deskripsi = ? WHERE id = ?",
        [name, eventDate, getText(lokasi), getText(deskripsi), id]
    );
    sendSuccess(response, "Event berhasil diperbarui");
});

app.delete("/api/events/delete", async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID event wajib diisi");

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute("UPDATE galeri SET event_id = NULL WHERE event_id = ?", [id]);
        await connection.execute("DELETE FROM events WHERE id = ?", [id]);
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
});

app.get("/api/layanan", async (request, response) => {
    const [data] = await pool.query("SELECT * FROM layanan ORDER BY id DESC");
    sendSuccess(response, null, { data });
});

app.post("/api/layanan/create", async (request, response) => {
    const { nama_layanan: namaLayanan, deskripsi } = getBody(request);
    const name = getText(namaLayanan);
    if (!name) throw new HttpError(400, "Nama layanan wajib diisi");

    const [result] = await pool.execute(
        "INSERT INTO layanan (nama_layanan, deskripsi) VALUES (?, ?)",
        [name, getText(deskripsi)]
    );
    sendSuccess(response, "Layanan berhasil ditambahkan", { id: result.insertId });
});

app.put("/api/layanan/update", async (request, response) => {
    const { id: rawId, nama_layanan: namaLayanan, deskripsi } = getBody(request);
    const id = getId(rawId);
    const name = getText(namaLayanan);
    if (!id || !name) throw new HttpError(400, "ID dan nama layanan wajib diisi");

    await pool.execute(
        "UPDATE layanan SET nama_layanan = ?, deskripsi = ? WHERE id = ?",
        [name, getText(deskripsi), id]
    );
    sendSuccess(response, "Layanan berhasil diperbarui");
});

app.delete("/api/layanan/delete", async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID layanan wajib diisi");
    await pool.execute("DELETE FROM layanan WHERE id = ?", [id]);
    sendSuccess(response, "Layanan berhasil dihapus");
});

app.get("/api/galeri", async (request, response) => {
    const [data] = await pool.query("SELECT * FROM galeri ORDER BY id DESC");
    sendSuccess(response, null, { data });
});

app.post("/api/galeri/create", upload.single("gambar"), async (request, response) => {
    const { judul, deskripsi } = getBody(request);
    const title = getText(judul);
    if (!title) throw new HttpError(400, "Judul galeri wajib diisi");

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
});

app.post("/api/galeri/update", upload.single("gambar"), async (request, response) => {
    const { id: rawId, judul, deskripsi } = getBody(request);
    const id = getId(rawId);
    const title = getText(judul);
    if (!id || !title) throw new HttpError(400, "Data tidak lengkap");

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
});

app.post("/api/galeri/delete", async (request, response) => {
    const id = getId(getBody(request).id);
    if (!id) throw new HttpError(400, "ID tidak valid");

    const [rows] = await pool.execute("SELECT gambar FROM galeri WHERE id = ?", [id]);
    if (rows.length === 0) throw new HttpError(404, "Data galeri tidak ditemukan");
    await pool.execute("DELETE FROM galeri WHERE id = ?", [id]);
    await removeUpload(rows[0].gambar);
    sendSuccess(response, "Galeri berhasil dihapus");
});

app.post("/api/kontak/create", async (request, response) => {
    const { nama, email, no_hp: noHp, pesan } = getBody(request);
    const name = getText(nama);
    const address = getText(email);
    const message = getText(pesan);

    if (!name || !address || !message) {
        throw new HttpError(400, "Nama, email, dan pesan wajib diisi");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new HttpError(400, "Format email tidak valid");
    }

    await pool.execute(
        "INSERT INTO kontak (nama, email, no_hp, pesan) VALUES (?, ?, ?, ?)",
        [name, address, getText(noHp), message]
    );
    sendSuccess(response, "Pesan berhasil dikirim");
});

app.post("/api/auth/login", async (request, response) => {
    const { email, password } = getBody(request);
    const address = getText(email);
    if (!address || typeof password !== "string" || password === "") {
        throw new HttpError(400, "Email dan password wajib diisi");
    }

    const [rows] = await pool.execute(
        "SELECT id, nama, email, password FROM users WHERE email = ? LIMIT 1",
        [address]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpError(401, "Email atau password salah");
    }

    const { password: storedPassword, ...userData } = user;
    sendSuccess(response, "Login berhasil", { data: userData });
});

app.use((request, response) => {
    response.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return response.status(400).json({
            success: false,
            message: "Ukuran gambar maksimal 5 MB"
        });
    }
    if (error instanceof multer.MulterError) {
        return response.status(400).json({ success: false, message: "Gagal mengupload gambar" });
    }

    if (error instanceof HttpError) {
        return response.status(error.status).json({ success: false, message: error.message });
    }

    console.error("Backend request failed:", error);
    return response.status(500).json({
        success: false,
        message: "Terjadi kesalahan server"
    });
});

await mkdir(uploadsDirectory, { recursive: true });
await pool.query("SELECT 1");
app.listen(port, () => {
    console.log(`Backend Node.js berjalan di http://localhost:${port}`);
});
