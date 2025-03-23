export type User = {
  id: string;
  name: string;
  email: string;
};

export type TransactionStatus = "PENDING" | "SUCCESSFUL" | "REJECTED";

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

export interface TransactionFilled
  extends Omit<Transaction, "recipientId" | "senderId"> {
  recipient: User;
  sender: Pick<User, "name">;
}

export interface TransactionMini {
  id: string;
  sender: { name: string };
  recipient: {
    name: string;
  };
  amount: number;
  status: TransactionStatus;
}
