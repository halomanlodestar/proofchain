import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z
    .string({
      message: "Please enter a valid amount",
    })
    .transform((v) => Number(v))
    .refine((v) => v > 0, {
      message: "Please enter a valid amount",
    }),
  expirationTime: z.date(),
  recipientId: z.string().nonempty({
    message: "Please select a recipient",
  }),
});

export type CreateTransactionValues = z.infer<typeof createTransactionSchema>;
