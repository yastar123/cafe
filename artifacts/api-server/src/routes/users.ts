import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));
  res.json(allUsers);
});

router.patch("/admin/users/:id/role", requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!["admin", "customer"].includes(role)) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, String(req.params.id)))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  await db.delete(users).where(eq(users.id, String(req.params.id)));
  res.json({ message: "Deleted" });
});

export default router;
