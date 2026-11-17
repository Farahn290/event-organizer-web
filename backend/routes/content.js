import { Router } from "express";
import { requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { listServices, createService, updateService, deleteService, listGallery, createGallery, updateGallery, deleteGallery, createContact, listContacts, deleteContact } from "../controllers/content.js";

const router = Router();

router.get("/api/layanan", listServices);
router.post("/api/layanan/create", requireRole("admin"), createService);
router.put("/api/layanan/update", requireRole("admin"), updateService);
router.delete("/api/layanan/delete", requireRole("admin"), deleteService);
router.get("/api/galeri", listGallery);
router.post("/api/galeri/create", requireRole("admin"), upload.single("gambar"), createGallery);
router.post("/api/galeri/update", requireRole("admin"), upload.single("gambar"), updateGallery);
router.post("/api/galeri/delete", requireRole("admin"), deleteGallery);
router.post("/api/kontak/create", createContact);
router.get("/api/kontak", requireRole("admin"), listContacts);
router.delete("/api/kontak/delete", requireRole("admin"), deleteContact);

export default router;
