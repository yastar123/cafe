import { Router } from "express";
import { db } from "@workspace/db";
import { paymentChannels } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import { z } from "zod";

const router = Router();

router.get("/payment-channels", async (_req, res) => {
  const channels = await db
    .select()
    .from(paymentChannels)
    .where(eq(paymentChannels.active, true))
    .orderBy(asc(paymentChannels.createdAt));
  res.json(channels);
});

router.get("/admin/payment-channels", requireAdmin, async (_req, res) => {
  const channels = await db
    .select()
    .from(paymentChannels)
    .orderBy(asc(paymentChannels.createdAt));
  res.json(channels);
});

const channelSchema = z.object({
  name: z.string().min(1),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  instructions: z.string().optional(),
  active: z.boolean().optional().default(true),
});

router.post("/admin/payment-channels", requireAdmin, async (req, res) => {
  const parsed = channelSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const data = parsed.data;
  const [channel] = await db
    .insert(paymentChannels)
    .values({
      name: data.name,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      instructions: data.instructions,
      active: data.active ?? true,
    })
    .returning();
  res.status(201).json(channel);
});

router.put("/admin/payment-channels/:id", requireAdmin, async (req, res) => {
  const parsed = channelSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const data = parsed.data;
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber;
  if (data.accountName !== undefined) updateData.accountName = data.accountName;
  if (data.instructions !== undefined) updateData.instructions = data.instructions;
  if (data.active !== undefined) updateData.active = data.active;

  const [channel] = await db
    .update(paymentChannels)
    .set(updateData)
    .where(eq(paymentChannels.id, req.params.id))
    .returning();

  if (!channel) {
    res.status(404).json({ error: "Channel not found" });
    return;
  }
  res.json(channel);
});

router.delete("/admin/payment-channels/:id", requireAdmin, async (req, res) => {
  await db.delete(paymentChannels).where(eq(paymentChannels.id, req.params.id));
  res.json({ message: "Deleted" });
});

export default router;
