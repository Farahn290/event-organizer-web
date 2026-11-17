import multer from "multer";
import { HttpError } from "../src/api-helpers.js";

export const notFoundHandler = (request, response) => {
    response.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
};

export const errorHandler = (error, request, response, next) => {
    if (response.headersSent) return next(error);

    if (error instanceof SyntaxError && "body" in error) {
        return response.status(400).json({ success: false, message: "Format JSON tidak valid" });
    }
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
};
