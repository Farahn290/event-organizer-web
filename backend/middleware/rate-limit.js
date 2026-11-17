import { rateLimit } from "express-rate-limit";

const createAuthRateLimit = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (request) => request.method !== "POST",
    message: { success: false, message: "Terlalu banyak percobaan; coba lagi dalam 15 menit" }
});

export const loginRateLimit = createAuthRateLimit();
export const registerRateLimit = createAuthRateLimit();
