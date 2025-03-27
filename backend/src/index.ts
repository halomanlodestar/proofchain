/** @format */

import express from "express";
import { mainRouter } from "./routes";
import { env } from "./config/env";
import { prisma } from "./utils/prisma-client";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./utils/logger";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import responseTime from "response-time";
import * as process from "node:process";

env();

const app = express();
const init = async () => {
  logger.info("🚀 Starting server...");
  logger.info("🔌 Connecting to database...");
  await prisma.$connect().then(() => logger.info("✅ Connected to database"));

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: ["http://localhost:5173", process.env.FRONTEND_URL!],
      credentials: true,
    }),
  );
  app.use(responseTime());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      skip: (req) => {
        return req.url.includes("/api/v1/auth/refresh");
      },
    }),
  );
  app.use("/api/v1", mainRouter);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => logger.info(`✅ Running app at ${PORT}`));
};

init();
