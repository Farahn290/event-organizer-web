import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { listEventTickets, createEventTicket, updateEventTicket, deleteEventTicket } from "../controllers/tickets.js";

const router = Router();

router.get("/api/events/:eventId/tiket", listEventTickets);
router.post("/api/events/:eventId/tiket", requireRole("admin", "panitia"), createEventTicket);
router.put("/api/events/:eventId/tiket/:tiketId", requireRole("admin", "panitia"), updateEventTicket);
router.delete("/api/events/:eventId/tiket/:tiketId", requireRole("admin", "panitia"), deleteEventTicket);

export default router;
