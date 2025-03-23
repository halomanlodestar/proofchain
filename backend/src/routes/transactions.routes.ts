/** @format */

import {
  acceptTransaction,
  getTransactionBetween,
  getTransactionsFrom,
  getTransactionsIncluding,
  getTransactionsTo,
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

transactionsRouter.get("/:id", getTransactionById);
transactionsRouter.post(
  "/",
  authMiddleware,
  ValidationPipe(createTransactionSchema),
  createTransaction,
);
transactionsRouter.get("/from/:id", getTransactionsFrom);
transactionsRouter.get("/to/:id", getTransactionsTo);
transactionsRouter.get("/including/:id", getTransactionsIncluding);
transactionsRouter.get("/from/:senderId/to/:receiverId", getTransactionBetween);
transactionsRouter.put("/accept/:id", authMiddleware, acceptTransaction);
transactionsRouter.put("/reject/:id", authMiddleware, rejectTransaction);

export default transactionsRouter;
