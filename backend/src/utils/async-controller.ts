/** @format */

import { NextFunction, Request, Response } from "express";
import { Controller } from "../types";
import { HttpError } from "./http-utils/errors";
import { HttpResponse } from "./http-utils";
import { logger } from "./logger";

export const controller = (fn: Controller): Controller => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: HttpResponse = await fn(req, res, next);
      logger.info(req.url, response, fn.name, res.getHeaders());
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      else
        res.status(500).json({
          message: "Internal Server Error from async controller",
        });
    }
  };
};
