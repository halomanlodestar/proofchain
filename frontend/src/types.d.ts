import { AxiosError } from "axios";
import globals = require("globals");

export type User = {
  id: string;
  name: string;
  email: string;
};

export type TransactionMode = "CASH" | "UPI";

export type TransactionStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "REJECTED"
  | "EXPIRED";

export interface Transaction {
  id: string;
  senderId: string;
  recipientId: string;
  amount: number;
  // acceptedAt: Date | null;
  status: TransactionStatus;
  expirationTime: Date;
  signature: string;
  // previousHash: string;
  mode: TransactionMode;
  updatedAt: Date;
  createdAt: Date;
  rejectionReason: string | null;
}

export interface TransactionFilled
  extends Omit<Transaction, "recipientId" | "senderId"> {
  recipient: User;
  sender: Pick<User, "name">;
}

export interface TransactionMini {
  id: string;
  createdAt: Date;
  sender: User;
  recipient: User;
  amount: number;
  mode: TransactionMode;
  status: TransactionStatus;
}
