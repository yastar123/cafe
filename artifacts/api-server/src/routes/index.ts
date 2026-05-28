import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import menuRouter from "./menu.js";
import ordersRouter from "./orders.js";
import usersRouter from "./users.js";
import paymentsRouter from "./payments.js";
import uploadRouter from "./upload.js";
import categoriesRouter from "./categories.js";
import rekapRouter from "./rekap.js";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(ordersRouter);
router.use(usersRouter);
router.use(paymentsRouter);
router.use(uploadRouter);
router.use(categoriesRouter);
router.use(rekapRouter);

export default router;
