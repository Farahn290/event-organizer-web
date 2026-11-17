import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.js";

const router = Router();

router.get("/api/profil", requireRole("admin", "panitia", "peserta"), getProfile);
router.put("/api/profil", requireRole("admin", "panitia", "peserta"), updateProfile);
router.put("/api/profil/password", requireRole("admin", "panitia", "peserta"), changePassword);

export default router;
