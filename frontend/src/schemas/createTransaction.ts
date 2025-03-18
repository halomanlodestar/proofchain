import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number(),
  expirationTime: z.date(),
  recipientId: z.string(),
});

export type CreateTransactionValues = z.infer<typeof createTransactionSchema>;
