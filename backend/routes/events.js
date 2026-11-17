import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { listEvents, createEvent, updateEvent, deleteEvent } from "../controllers/events.js";

const router = Router();

router.get("/api/events", listEvents);
router.post("/api/events/create", requireRole("admin", "panitia"), createEvent);
router.put("/api/events/update", requireRole("admin", "panitia"), updateEvent);
router.delete("/api/events/delete", requireRole("admin", "panitia"), deleteEvent);

export default router;
