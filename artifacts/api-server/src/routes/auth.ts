import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, deleteSession, requireAuth } from "../lib/auth.js";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  const user = result[0];
  if (!user) {
    res.status(401).json({ error: "Nama pengguna atau kata sandi salah" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Nama pengguna atau kata sandi salah" });
    return;
  }

  const token = await createSession(user.id);
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
  });
});

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { username, email, password } = parsed.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length) {
    res.status(409).json({ error: "Nama pengguna sudah digunakan. Silakan pilih yang lain." });
    return;
  }

  const existingEmail = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingEmail.length) {
    res.status(409).json({ error: "Email sudah terdaftar. Silakan gunakan email lain." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [newUser] = await db
    .insert(users)
    .values({ username, email, passwordHash, role: "customer" })
    .returning();

  res.status(201).json({ message: "Akun berhasil dibuat", userId: newUser.id });
});

router.post("/auth/logout", requireAuth, async (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) await deleteSession(token);
  res.json({ message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const user = (req as any).user;
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

export default router;
