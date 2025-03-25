/** @format */

import {
  acceptTransaction,
  getTransactions,
  getTransactionsWith,
  rejectTransaction,
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

transactionsRouter.get("/", authMiddleware, getTransactions);
transactionsRouter.get("/:id", getTransactionById);
transactionsRouter.post(
  "/",
  authMiddleware,
  ValidationPipe(createTransactionSchema),
  createTransaction,
);
transactionsRouter.get("/with/:otherId", getTransactionsWith);
transactionsRouter.put("/:id/accept", authMiddleware, acceptTransaction);
transactionsRouter.put("/:id/reject", authMiddleware, rejectTransaction);

export default transactionsRouter;
