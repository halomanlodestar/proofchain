/** @format */

import {
  acceptTransaction,
  getPendingTransactionsFrom,
  getRejectedTransactionsFrom,
  getTransactionBetween,
  getTransactionsFrom,
  getTransactionsTo,
} from "../controllers/transactions.controller";
import { Router } from "express";
import {
  createTransaction,
  getTransactionById,
} from "../controllers/transactions.controller";
import { createTransactionSchema } from "../schemas/transactions.schema";
import ValidationPipe from "../pipes/validation.pipes";
import { authMiddleware } from "../middlewares/auth.middlewares";
const transactionsRouter = Router();

transactionsRouter.get("/:id", getTransactionById);
transactionsRouter.post(
  "/",
  authMiddleware,
  ValidationPipe(createTransactionSchema),
  createTransaction,
);
transactionsRouter.get("/from/:id", getTransactionsFrom);
transactionsRouter.get("/from/:id/pending", getPendingTransactionsFrom);
transactionsRouter.get("/from/:id/rejected", getRejectedTransactionsFrom);
transactionsRouter.get("/to/:id", getTransactionsTo);
transactionsRouter.get("/from/:senderId/to/:receiverId", getTransactionBetween);
transactionsRouter.post("/accept/:id", authMiddleware, acceptTransaction);

export default transactionsRouter;
