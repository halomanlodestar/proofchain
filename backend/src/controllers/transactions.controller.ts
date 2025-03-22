/** @format */

import jwt from "jsonwebtoken";
import { createTransactionSchema } from "../schemas/transactions.schema";
import { z } from "zod";
import { prisma } from "../utils/prisma-client";
import { HttpResponse, HttpStatus } from "../utils/http-utils";
import { controller } from "../utils/async-controller";
import { InternalServerError } from "../utils/http-utils/errors/5xx-error";
import {
  NotFoundError,
  UnauthorizedError,
} from "../utils/http-utils/errors/4xx-error";

export const getTransactionById = controller(async (req) => {
  const id = req.params.id;
  console.log(id);

  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    omit: {
      senderId: true,
      recipientId: true,
    },
    include: {
      sender: {
        select: {
          email: true,
          name: true,
          id: true,
        },
      },
      recipient: {
        select: {
          email: true,
          name: true,
          id: true,
        },
      },
    },
  });

  return new HttpResponse(HttpStatus.OK, { transaction });
});

export const getTransactionsFrom = controller(async (req) => {
  const id = req.params.id;

  const transactions = await prisma.transaction.findMany({
    where: {
      senderId: id,
    },
    select: {
      sender: {
        select: { name: true },
      },
      recipient: {
        select: { name: true },
      },
      amount: true,
      status: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getTransactionsTo = controller(async (req) => {
  const id = req.params.id;

  const transactions = await prisma.transaction.findMany({
    where: {
      recipientId: id,
    },
    select: {
      id: true,
      sender: {
        select: { name: true },
      },
      recipient: {
        select: { name: true },
      },
      amount: true,
      status: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getTransactionBetween = controller(async (req) => {
  const senderId = req.params.senderId;
  const recipientId = req.params.recipientId;

  const transactions = await prisma.transaction.findMany({
    where: {
      senderId,
      recipientId,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getPendingTransactionsFrom = controller(async (req) => {
  const id = req.params.id;

  const transactions = await prisma.pendingTransaction.findMany({
    where: {
      senderId: id,
    },
    select: {
      id: true,
      sender: {
        select: { name: true },
      },
      recipient: {
        select: { name: true },
      },
      amount: true,
      status: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getRejectedTransactionsFrom = controller(async (req) => {
  const id = req.params.id;

  const transactions = await prisma.rejectedTransaction.findMany({
    where: {
      senderId: id,
    },
    select: {
      id: true,
      sender: {
        select: { name: true },
      },
      recipient: {
        select: { name: true },
      },
      amount: true,
      status: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const createTransaction = controller(async (req) => {
  console.log(req.body);

  const { amount, expirationTime, recipientId } = req.body as z.infer<
    typeof createTransactionSchema
  >;

  const { id: senderId } = req?.user!;

  console.log(senderId, recipientId);

  if (senderId === recipientId) {
    throw new UnauthorizedError("You cannot send money to yourself");
  }

  // Find last transaction made by the user
  const { signature: previousHash } = (await prisma.transaction.findFirst({
    where: {
      senderId,
      recipientId,
    },
    orderBy: {
      initialisedAt: "desc",
    },
    select: {
      signature: true,
    },
  })) ?? { signature: (Math.random() * 1_000_000).toString() };

  const signature = jwt.sign(
    { amount, expirationTime, recipientId, senderId, previousHash },
    process.env.JWT_SECRET!,
  );

  try {
    await prisma.pendingTransaction.create({
      data: {
        amount,
        expirationTime,
        recipientId,
        senderId,
        signature,
        previousHash,
      },
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError("Internal server error");
  }

  return new HttpResponse(HttpStatus.CREATED, { signature });
});

export const acceptTransaction = controller(async (req) => {
  const id = req.params.id;

  const pendingTransaction = await prisma.pendingTransaction.findUnique({
    where: {
      id,
    },
  });

  if (!pendingTransaction) {
    throw new NotFoundError("Transaction not found");
  }

  const { amount, expirationTime, recipientId, senderId, previousHash } =
    jwt.verify(pendingTransaction.signature, process.env.JWT_SECRET!) as {
      amount: number;
      expirationTime: string;
      recipientId: string;
      senderId: string;
      previousHash: string;
    };

  const { id: userId } = req?.user!;

  // console.log(userId, recipientId);

  if (userId !== recipientId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      expirationTime,
      acceptedAt: new Date().toISOString(),
      recipientId,
      senderId,
      signature: pendingTransaction.signature,
      previousHash,
      status: "SUCCESSFUL",
    },
  });

  await prisma.pendingTransaction.delete({
    where: {
      id,
    },
  });

  return new HttpResponse(HttpStatus.CREATED, { transaction });
});

export const rejectTransaction = controller(async (req) => {
  const id = req.params.id;

  const pendingTransaction = await prisma.pendingTransaction.findUnique({
    where: {
      id,
    },
  });

  if (!pendingTransaction) {
    throw new NotFoundError("Transaction not found");
  }

  const { recipientId } = jwt.verify(
    pendingTransaction.signature,
    process.env.JWT_SECRET!,
  ) as {
    recipientId: number;
  };

  const { id: userId } = req?.user!;

  if (userId !== recipientId) {
    throw new UnauthorizedError("Unauthorized");
  }

  await prisma.pendingTransaction.delete({
    where: {
      id,
    },
  });

  prisma.rejectedTransaction.create({
    data: {
      ...pendingTransaction,
      status: "REJECTED",
    },
  });

  return new HttpResponse(HttpStatus.NO_CONTENT);
});
