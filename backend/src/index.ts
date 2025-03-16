/** @format */

import express from "express";
import { mainRouter } from "./routes";
import { env } from "./config/env";
import { prisma } from "./utils/prisma-client";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./utils/logger";

env();

const app = express();
const init = async () => {
  logger.info("🚀 Starting server...");
  logger.info("🔌 Connecting to database...");
  await prisma.$connect().then(() => logger.info("✅ Connected to database"));

  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    }),
  );
  app.use(morgan("dev"));
  app.use(express.json());
  app.use("/api/v1", mainRouter);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => logger.info(`✅ Running app at ${PORT}`));
};

init();
