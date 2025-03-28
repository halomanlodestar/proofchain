import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma-client";
import { Controller } from "../types";
import { UnauthorizedError } from "../utils/http-utils/errors/4xx-error";
import { controller } from "../utils/async-controller";
import { HttpResponse } from "../utils/http-utils";

export const authMiddleware: Controller = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      exp: number;
    };
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  if (Date.now() >= payload.exp) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  req.user =
    (await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })) ?? undefined;

  next();
};
