import express from "express";
import { uploadsDirectory } from "../src/config.js";
import { loginRateLimit, registerRateLimit } from "./rate-limit.js";
import { configureSecurityMiddleware } from "./security.js";

export const configureAppMiddleware = (app) => {
    configureSecurityMiddleware(app);
    app.use("/api/auth/login", loginRateLimit);
    app.use("/api/auth/register", registerRateLimit);
    app.use(express.json({ limit: "1mb" }));
    app.use("/uploads", express.static(uploadsDirectory));
};
