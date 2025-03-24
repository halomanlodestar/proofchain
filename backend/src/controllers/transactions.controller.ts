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

export const getTransactionsIncluding = controller(async (req) => {
  const id = req.params.id;
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
        select: { name: true },
      },
      recipient: {
        select: { name: true },
      },
      amount: true,
      status: true,
      mode: true,
      initialisedAt: true,
    },
  });

  return new HttpResponse(HttpStatus.OK, { transactions });
});

export const getTransactionsFrom = controller(async (req) => {
  const senderId = req.params.id;
  const status = (req.query.status as TransactionStatus) || undefined;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        senderId,
        status,
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
  } catch (e: unknown) {
    console.log(e);
    throw new InternalServerError("Internal server error");
  }
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

export const createTransaction = controller(async (req) => {
  console.log(req.body);

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
  console.log("reached controller");

  const id = req.params.id;
  const { id: recipientId } = req.user!;

  try {
    const transaction = await prisma.transaction.update({
      where: {
        id,
        recipientId,
        status: "PENDING",
      },
      data: {
        status: "SUCCESSFUL",
        acceptedAt: new Date(),
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
    const transaction = await prisma.transaction.update({
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
