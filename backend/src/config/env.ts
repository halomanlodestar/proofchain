/** @format */

import { envSchema } from "../schemas/env.schema";
import { config } from "dotenv";
import { z } from "zod";
import { logger } from "../utils/logger";

export const env = (): z.infer<typeof envSchema> => {
  config({
    path: [".env", ".env.local"],
  });

  envSchema.parse(process.env);

  logger.info("✅ Environment variables loaded successfully");
  return envSchema.parse(process.env);
};
