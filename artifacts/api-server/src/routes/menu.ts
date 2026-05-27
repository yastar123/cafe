import { Router } from "express";
import { db } from "@workspace/db";
import { menuItems } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import { z } from "zod";

const router = Router();

router.get("/menu", async (_req, res) => {
  const items = await db.select().from(menuItems).orderBy(asc(menuItems.category));
  res.json(items);
});

const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  available: z.boolean().optional().default(true),
});

router.post("/menu", requireAdmin, async (req, res) => {
  const parsed = menuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const data = parsed.data;
  const [item] = await db
    .insert(menuItems)
    .values({
      name: data.name,
      description: data.description,
      category: data.category,
      price: String(data.price),
      imageUrl: data.imageUrl,
      available: data.available ?? true,
    })
    .returning();
  res.status(201).json(item);
});

router.put("/menu/:id", requireAdmin, async (req, res) => {
  const parsed = menuItemSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const data = parsed.data;
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.price !== undefined) updateData.price = String(data.price);
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.available !== undefined) updateData.available = data.available;

  const [item] = await db
    .update(menuItems)
    .set(updateData)
    .where(eq(menuItems.id, String(req.params.id)))
    .returning();

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(item);
});

router.delete("/menu/:id", requireAdmin, async (req, res) => {
  await db.delete(menuItems).where(eq(menuItems.id, String(req.params.id)));
  res.json({ message: "Deleted" });
});

export default router;
