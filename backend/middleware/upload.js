import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { uploadsDirectory } from "../src/config.js";
import { HttpError } from "../src/api-helpers.js";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

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

export const removeUpload = async (fileName) => {
    if (!fileName) return;

    try {
        await rm(path.join(uploadsDirectory, path.basename(fileName)), { force: true });
    } catch (error) {
        console.error("Failed to remove uploaded image:", error);
    }
};

export const saveImage = async (file) => {
    if (!file) throw new HttpError(400, "Gambar wajib dipilih");
    const extension = getImageExtension(file.buffer);
    if (!extension) throw new HttpError(400, "Format gambar harus JPG, PNG, atau WEBP");

    const fileName = `galeri_${randomUUID()}.${extension}`;
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(uploadsDirectory, fileName), file.buffer, { flag: "wx" });
    return fileName;
};
