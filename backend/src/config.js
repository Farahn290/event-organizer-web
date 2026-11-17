import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

export const port = Number(process.env.PORT || 8000);
export const uploadsDirectory = fileURLToPath(new URL("../uploads/", import.meta.url));
export const authTokenSecret = process.env.AUTH_TOKEN_SECRET || (
    process.env.NODE_ENV === "production"
        ? ""
        : randomBytes(48).toString("base64url")
);
export const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173"];

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT harus berupa angka antara 1 dan 65535");
}
if (!authTokenSecret && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_TOKEN_SECRET wajib dikonfigurasi di production");
}
if (authTokenSecret && Buffer.byteLength(authTokenSecret) < 32) {
    throw new Error("AUTH_TOKEN_SECRET harus memiliki minimal 32 byte");
}
if (!process.env.AUTH_TOKEN_SECRET) {
    console.warn("AUTH_TOKEN_SECRET tidak diatur; token admin hanya berlaku sampai backend dimulai ulang.");
}
if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN wajib dikonfigurasi di production");
}
