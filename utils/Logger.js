const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const transport = new winston.transports.DailyRotateFile({
    filename: path.join("logs", "execution-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d"
});
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({
            stack: true
        }),
        winston.format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
        })
    ),
    transports: [
        transport,
        new winston.transports.Console()
    ]
});
module.exports = logger;