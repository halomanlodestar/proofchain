import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [
    // Console transport for non-error logs
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(), // Colorized output
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    }),

    // File transport for only error logs
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
  ],
});
