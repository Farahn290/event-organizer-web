import { Router } from "express";
import authRoutes from "./auth.js";
import contentRoutes from "./content.js";
import eventRoutes from "./events.js";
import healthRoutes from "./health.js";
import profileRoutes from "./profile.js";
import registrationRoutes from "./registrations.js";
import ticketRoutes from "./tickets.js";
import transactionRoutes from "./transactions.js";

const router = Router();

router.use(healthRoutes);
router.use(eventRoutes);
router.use(ticketRoutes);
router.use(registrationRoutes);
router.use(transactionRoutes);
router.use(contentRoutes);
router.use(profileRoutes);
router.use(authRoutes);

export default router;
