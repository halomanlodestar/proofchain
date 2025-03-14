/** @format */

import { prisma } from "../utils/prisma-client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../utils/async-controller";
import { HttpResponse } from "../utils/http-utils";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/http-utils/errors/4xx-error";
import { InternalServerError } from "../utils/http-utils/errors/5xx-error";

const ACCESS_TOKEN_EXPIRY = 1000 * 60 * 15;
const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7;

export const login = controller(async (req, res) => {
  const { email, password } = req.body;

  const loggedIn = req.cookies.refresh_token;

  if (loggedIn) {
    return new HttpResponse(200, { message: "Already Logged In" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return new HttpResponse(401, { message: "Invalid credentials" });
  }

  const refreshToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
  );

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: refreshToken,
      },
    });
  } catch (error) {
    throw new InternalServerError("Internal Server Error");
  }

  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    httpOnly: true,
    sameSite: "lax",
  });

  return new HttpResponse(200, { message: "Logged in" });
});

export const register = controller(async (req) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new HttpResponse(201, { user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      throw new BadRequestError("Already Registered");
  }
});

export const logout = controller((_req, res) => {
  res.clearCookie("refresh_token");

  return new HttpResponse(204);
});

export const refresh = controller(async (req) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  let payload: any;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET!);
  } catch (error) {
    throw new UnauthorizedError("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  const accessToken = jwt.sign(
    { id: user.id, exp: Date.now() + ACCESS_TOKEN_EXPIRY },
    process.env.JWT_SECRET!,
    {},
  );

  return new HttpResponse(200, { accessToken });
});

export const me = controller(async (req) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    throw new UnauthorizedError("Unauthorized");
  }

  let payload: any;

  try {
    payload = jwt.verify(accessToken, process.env.JWT_SECRET!);
  } catch (error) {
    throw new UnauthorizedError("Unauthorized");
  }

  console.log(payload);

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  console.log("user", user);

  return new HttpResponse(200, { user });
});
