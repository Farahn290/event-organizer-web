import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { register, login, logout } from "../controllers/auth.js";

const router = Router();

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);

export default router;
