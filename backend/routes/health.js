import { Router } from "express";
import { healthCheck } from "../controllers/health.js";

const router = Router();

router.get("/api/health", healthCheck);

export default router;
