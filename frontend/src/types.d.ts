export type User = {
  id: string;
  name: string;
  email: string;
};

export type TransactionStatus = "pending" | "confirmed" | "rejected";

export interface Transaction {
  id: string;
  initialisedAt: Date;
  senderId: string;
  recipientId: string;
  amount: number;
  acceptedAt: Date | null;
  status: TransactionStatus;
  expirationTime: Date;
  signature: string;
  previousHash: string;
  rejectionReason: string | null;
}
