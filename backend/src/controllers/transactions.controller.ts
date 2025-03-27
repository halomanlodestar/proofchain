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
import { Prisma, TransactionStatus } from "@prisma/client";

export const getTransactionById = controller(async (req) => {
  const id = req.params.id;

  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    omit: {
      senderId: true,
      recipientId: true,
      previousHash: true,
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

export const getTransactions = controller(async (req) => {
  const id = req.user?.id;
  const status = (req.query.status as TransactionStatus) || undefined;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          senderId: id,
        },
        {
          recipientId: id,
        },
      ],
      status,
    },
    select: {
      id: true,
      sender: {
        select: { name: true, email: true, id: true },
      },
      recipient: {
        select: { name: true, email: true, id: true },
      },
      amount: true,
      status: true,
      mode: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getTransactionsWith = controller(async (req) => {
  const id = req.user?.id;
  const otherId = req.params.otherId;

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          senderId: id,
          recipientId: otherId,
        },
        {
          senderId: otherId,
          recipientId: id,
        },
      ],
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
      mode: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getTotalMoneyOwed = controller(async (req) => {
  const senderId = req.user?.id;

  const total = await prisma.transaction.aggregate({
    where: {
      senderId,
      status: "SUCCESSFUL",
    },
    _sum: {
      amount: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { total });
});

export const createTransaction = controller(async (req) => {
  const { amount, expirationTime, recipientId } = req.body as z.infer<
    typeof createTransactionSchema
  >;

  const { id: senderId } = req?.user!;

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
      createdAt: "desc",
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
    await prisma.transaction.create({
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
  const { id: recipientId } = req.user!;

  try {
    await prisma.transaction.update({
      where: {
        id,
        recipientId,
        status: "PENDING",
      },
      data: {
        status: "SUCCESSFUL",
      },
    });

    return new HttpResponse(HttpStatus.NO_CONTENT);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new NotFoundError("Transaction not found");
      }
    }

    throw new InternalServerError("Internal server error");
  }
});

export const rejectTransaction = controller(async (req) => {
  const id = req.params.id;
  const { id: recipientId } = req.user!;

  try {
    await prisma.transaction.update({
      where: {
        id,
        recipientId,
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
      },
    });

    return new HttpResponse(HttpStatus.NO_CONTENT);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new NotFoundError("Transaction not found");
      }
    }

    throw new InternalServerError("Internal server error");
  }
});

export const deleteTransaction = controller(async (req) => {
  const id = req.params.id;
  const { id: senderId } = req.user!;

  try {
    await prisma.transaction.delete({
      where: {
        id,
        status: "PENDING",
        senderId,
      },
    });

    return new HttpResponse(HttpStatus.NO_CONTENT);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new UnauthorizedError("Only pending transactions can be deleted");
      }
    }

    throw new InternalServerError("Internal server error");
  }
});
