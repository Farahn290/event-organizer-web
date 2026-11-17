import { mkdir } from "node:fs/promises";
import express from "express";
import pool from "./src/database.js";
import { port, uploadsDirectory } from "./src/config.js";
import { configureAppMiddleware } from "./middleware/app.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handlers.js";
import apiRouter from "./routes/index.js";

const app = express();

configureAppMiddleware(app);
app.use(apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

await mkdir(uploadsDirectory, { recursive: true });
await pool.query("SELECT 1");
app.listen(port, () => {
    console.log(`Backend Node.js berjalan di http://localhost:${port}`);
});
