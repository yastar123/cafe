import { Router } from "express";
import { db } from "@workspace/db";
import { categories } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";
import { z } from "zod";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  description: z.string().optional(),
});

// GET /api/categories - Public
router.get("/categories", async (_req, res) => {
  try {
    const list = await db.select().from(categories).orderBy(categories.name);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Gagal memuat kategori" });
  }
});

// POST /api/categories - Admin
router.post("/categories", requireAdmin, async (req, res) => {
  try {
    const validated = categorySchema.parse(req.body);
    
    // Check duplicate name
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, validated.name))
      .limit(1);

    if (existing.length) {
      res.status(400).json({ error: "Nama kategori sudah ada" });
      return;
    }

    const [inserted] = await db
      .insert(categories)
      .values({
        name: validated.name,
        description: validated.description,
      })
      .returning();

    res.status(201).json(inserted);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    res.status(500).json({ error: "Gagal menambahkan kategori" });
  }
});

// PUT /api/categories/:id - Admin
router.put("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const validated = categorySchema.parse(req.body);

    // Check duplicate name excluding current category
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, validated.name))
      .limit(1);

    if (existing.length && existing[0].id !== id) {
      res.status(400).json({ error: "Nama kategori sudah digunakan oleh kategori lain" });
      return;
    }

    const [updated] = await db
      .update(categories)
      .set({
        name: validated.name,
        description: validated.description,
      })
      .where(eq(categories.id, String(id)))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Kategori tidak ditemukan" });
      return;
    }

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    res.status(500).json({ error: "Gagal memperbarui kategori" });
  }
});

// DELETE /api/categories/:id - Admin
router.delete("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Optional: you can check if category has menu items before deleting, but let's just delete
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, String(id)))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Kategori tidak ditemukan" });
      return;
    }

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus kategori" });
  }
});

export default router;
