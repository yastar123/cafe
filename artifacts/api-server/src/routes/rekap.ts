import { Router } from "express";
import { db } from "@workspace/db";
import { orders, orderItems, menuItems, users } from "@workspace/db";
import { eq, desc, gte, lte, and, sql } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// GET /api/admin/rekap?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/admin/rekap", requireAdmin, async (req, res) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string };

    // Default: current month
    const now = new Date();
    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const fromDate = from ? new Date(from as string) : defaultFrom;
    const toDate = to ? new Date(`${to}T23:59:59`) : defaultTo;

    // Get all orders in range (with user info)
    const allOrders = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        totalAmount: orders.totalAmount,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        orderStatus: orders.orderStatus,
        notes: orders.notes,
        createdAt: orders.createdAt,
        username: users.username,
        email: users.email,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(and(gte(orders.createdAt, fromDate), lte(orders.createdAt, toDate)))
      .orderBy(desc(orders.createdAt));

    // Calculate summary
    const confirmedOrders = allOrders.filter((o) => o.paymentStatus === "confirmed");
    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0);
    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter((o) => o.orderStatus === "completed").length;
    const pendingOrders = allOrders.filter((o) => o.orderStatus === "pending").length;
    const cancelledOrders = allOrders.filter((o) => o.orderStatus === "cancelled").length;
    const avgOrderValue = confirmedOrders.length > 0 ? totalRevenue / confirmedOrders.length : 0;

    // Daily breakdown
    const dailyMap: Record<string, { date: string; revenue: number; orders: number; confirmedOrders: number }> = {};
    for (const o of allOrders) {
      const date = new Date(o.createdAt!).toISOString().split("T")[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { date, revenue: 0, orders: 0, confirmedOrders: 0 };
      }
      dailyMap[date].orders += 1;
      if (o.paymentStatus === "confirmed") {
        dailyMap[date].revenue += Number(o.totalAmount ?? 0);
        dailyMap[date].confirmedOrders += 1;
      }
    }
    const dailyRevenue = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

    // Payment method breakdown
    const paymentMethodMap: Record<string, { method: string; count: number; total: number }> = {};
    for (const o of allOrders) {
      const method = o.paymentMethod ?? "Lainnya";
      if (!paymentMethodMap[method]) {
        paymentMethodMap[method] = { method, count: 0, total: 0 };
      }
      paymentMethodMap[method].count += 1;
      if (o.paymentStatus === "confirmed") {
        paymentMethodMap[method].total += Number(o.totalAmount ?? 0);
      }
    }
    const byPaymentMethod = Object.values(paymentMethodMap);

    // Order status breakdown
    const statusMap: Record<string, number> = {};
    for (const o of allOrders) {
      const s = o.orderStatus ?? "unknown";
      statusMap[s] = (statusMap[s] ?? 0) + 1;
    }
    const byStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        confirmedOrders: confirmedOrders.length,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        avgOrderValue,
      },
      dailyRevenue,
      byPaymentMethod,
      byStatus,
      orders: allOrders.map((o) => ({
        id: o.id,
        tanggal: new Date(o.createdAt!).toLocaleDateString("id-ID"),
        pelanggan: o.username,
        email: o.email,
        totalAmount: Number(o.totalAmount ?? 0),
        metodePembayaran: o.paymentMethod,
        statusPembayaran: o.paymentStatus,
        statusPesanan: o.orderStatus,
        catatan: o.notes ?? "",
      })),
    });
  } catch (err) {
    console.error("Rekap error:", err);
    res.status(500).json({ error: "Gagal memuat data rekap" });
  }
});

export default router;
