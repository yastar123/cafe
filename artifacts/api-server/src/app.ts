import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import apiRouter from "./routes/index.js";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users } from "@workspace/db";
import { eq } from "drizzle-orm";

const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@coffeehouse.local";
const ADMIN_PASSWORD = "admin123";

let adminSeedPromise: Promise<void> | null = null;

async function ensureAdminSeed(): Promise<void> {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, ADMIN_USERNAME))
    .limit(1);

  if (existing.length) {
    await db
      .update(users)
      .set({
        role: "admin",
        email: ADMIN_EMAIL,
        passwordHash,
      })
      .where(eq(users.id, existing[0].id));
    return;
  }

  await db.insert(users).values({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
  });
}

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: [
    "https://cafe-coffee-house.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async (req, _res, next) => {
  try {
    if (req.method === "OPTIONS") {
      next();
      return;
    }
    adminSeedPromise ??= ensureAdminSeed();
    await adminSeedPromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api", apiRouter);

export default app;

