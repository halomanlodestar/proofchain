/** @format */
import { HttpResponse } from "../utils/http-utils";
import { controller } from "../utils/async-controller";

export const pingController = controller(async (req, res) => {
  return new HttpResponse(200, { message: "pong" });
});
