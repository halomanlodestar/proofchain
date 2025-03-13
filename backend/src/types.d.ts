/** @format */

import { NextFunction, Request, Response } from "express";

/** @format */
export type Controller = (
	req: Request,
	res: Response,
	next: NextFunction
) => HttpResponse | Promise<HttpResponse>;

declare global {
	namespace Express {
		interface Request {
			user?: SafeUser; // Extend this to match your structure
		}
	}

	namespace NodeJS {
		interface ProcessEnv {
			JWT_SECRET: string;
			DATABASE_URL: string;
		}
	}
}
