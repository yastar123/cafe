import express, { type Express } from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRouter);

export default app;

