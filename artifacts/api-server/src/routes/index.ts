import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import usersRouter from "./users";
import paymentsRouter from "./payments";
import uploadRouter from "./upload";
import categoriesRouter from "./categories";
import rekapRouter from "./rekap";

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
