import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { createTransaction, listMyTransactions, getTransactionRecap, confirmTransaction } from "../controllers/transactions.js";

const router = Router();

router.post("/api/transaksi", requireRole("peserta"), createTransaction);
router.get("/api/transaksi/saya", requireRole("peserta"), listMyTransactions);
router.get("/api/transaksi/rekap", requireRole("admin", "panitia"), getTransactionRecap);
router.put("/api/transaksi/:id/konfirmasi", requireRole("admin"), confirmTransaction);

export default router;
