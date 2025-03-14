/** @format */

import {
  acceptTransaction,
  getTransactionBetween,
  getTransactionsFrom,
  getTransactionsTo,
} from "../controllers/transactions.controller";
import { Router } from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transactions.controller";
import { createTransactionSchema } from "../schemas/transactions.schema";
import ValidationPipe from "../pipes/validation.pipes";
import { authMiddleware } from "../middlewares/auth.middlewares";
const transactionsRouter = Router();

transactionsRouter.get("/:id", getTransactions);
transactionsRouter.post(
  "/",
  authMiddleware,
  ValidationPipe(createTransactionSchema),
  createTransaction,
);
transactionsRouter.get("/from/:id", getTransactionsFrom);
transactionsRouter.get("/to/:id", getTransactionsTo);
transactionsRouter.get("/from/:senderId/to/:receiverId", getTransactionBetween);
transactionsRouter.post("/accept/:id", authMiddleware, acceptTransaction);

export default transactionsRouter;
