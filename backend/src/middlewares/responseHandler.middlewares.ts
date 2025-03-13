/** @format */

import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../utils/http-utils";
import { HttpError } from "../utils/http-utils/errors";

export const responseHandlerMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {};
