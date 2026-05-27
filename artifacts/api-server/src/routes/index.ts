import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import menuRouter from "./menu";
import ordersRouter from "./orders";
import usersRouter from "./users";
import paymentsRouter from "./payments";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(ordersRouter);
router.use(usersRouter);
router.use(paymentsRouter);
router.use(uploadRouter);

export default router;
