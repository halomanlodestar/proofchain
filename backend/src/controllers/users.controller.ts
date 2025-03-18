import { controller } from "../utils/async-controller";
import { BadRequestError } from "../utils/http-utils/errors/4xx-error";
import { prisma } from "../utils/prisma-client";
import { HttpResponse, HttpStatus } from "../utils/http-utils";

/** @format */
export const findUserByEmail = controller(async (req) => {
  const { email } = req.params;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return new HttpResponse(HttpStatus.OK, { user });
});
