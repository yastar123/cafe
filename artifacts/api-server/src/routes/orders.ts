import { Router } from "express";
import { db } from "@workspace/db";
import { orders, orderItems, menuItems, users } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";
import { z } from "zod";

const router = Router();

router.get("/orders", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));
  res.json(userOrders);
});

router.get("/admin/orders", requireAdmin, async (req, res) => {
  const allOrders = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      totalAmount: orders.totalAmount,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      orderStatus: orders.orderStatus,
      paymentProofUrl: orders.paymentProofUrl,
      notes: orders.notes,
      createdAt: orders.createdAt,
      username: users.username,
      email: users.email,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const result = allOrders.map((o) => ({
    ...o,
    users: { username: o.username, email: o.email },
  }));
  res.json(result);
});

router.get("/orders/:id/items", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const order = await db.select().from(orders).where(eq(orders.id, req.params.id)).limit(1);
  if (!order.length) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order[0].userId !== user.id && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      menuItemId: orderItems.menuItemId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      subtotal: orderItems.subtotal,
      menuItemName: menuItems.name,
    })
    .from(orderItems)
    .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(eq(orderItems.orderId, req.params.id));
  res.json(items);
});

const createOrderSchema = z.object({
  totalAmount: z.number().positive(),
  paymentMethod: z.string().min(1),
  notes: z.string().optional(),
  paymentProofUrl: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    subtotal: z.number().positive(),
  })).min(1),
});

router.post("/orders", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { totalAmount, paymentMethod, notes, paymentProofUrl, items } = parsed.data;

  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      totalAmount: String(totalAmount),
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      notes,
      paymentProofUrl,
    })
    .returning();

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      unitPrice: String(item.unitPrice),
      subtotal: String(item.subtotal),
    }))
  );

  res.status(201).json(order);
});

router.patch("/admin/orders/:id", requireAdmin, async (req, res) => {
  const { paymentStatus, orderStatus } = req.body;
  const updateData: Record<string, any> = {};
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (orderStatus) updateData.orderStatus = orderStatus;

  const [order] = await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, req.params.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

export default router;
