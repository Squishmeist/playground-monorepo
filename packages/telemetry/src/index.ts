import winston from "winston";
import LokiTransport from "winston-loki";

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new LokiTransport({
      host: "http://127.0.0.1:3100",
      labels: { service: "playground" },
      onConnectionError: (error) => {
        console.error("Loki connection error:", error);
      },
    }),
  ],
});
