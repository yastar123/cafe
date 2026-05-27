import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../lib/auth";

const router = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `proof_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diizinkan"));
    }
  },
});

router.post("/upload/payment-proof", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "File tidak ditemukan" });
    return;
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

router.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File tidak ditemukan" });
    return;
  }
  res.sendFile(filePath);
});

export default router;
