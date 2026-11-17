import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { createRegistration, listMyRegistrations, cancelRegistration, listEventRegistrations } from "../controllers/registrations.js";

const router = Router();

router.post("/api/pendaftaran", requireRole("peserta"), createRegistration);
router.get("/api/pendaftaran/saya", requireRole("peserta"), listMyRegistrations);
router.put("/api/pendaftaran/:id/batal", requireRole("peserta"), cancelRegistration);
router.get("/api/events/:eventId/pendaftaran", requireRole("admin", "panitia"), listEventRegistrations);

export default router;
