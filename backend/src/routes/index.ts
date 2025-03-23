/** @format */

import { Router } from "express";
import transactionsRouter from "./transactions.routes";
import { pingController } from "../controllers/ping.controller";
import authRouter from "./auth.routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import usersRoutes from "./users.routes";

const mainRouter = Router();

// Middlewares //
mainRouter.use(bodyParser.json());
mainRouter.use(cookieParser());

// Routes //
mainRouter.use("/transactions", transactionsRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/ping", pingController);
mainRouter.use("/users", usersRoutes);

// Wrapping all routes with asyncHandler //
export { mainRouter };
