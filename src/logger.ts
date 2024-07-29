// logger.ts
import { createLogger, format, transports } from "winston";
import { Writable } from "stream";

const logger = createLogger({
   level: "info",
   format: format.combine(
      format.timestamp({
         format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
   ),
   transports: [
      new transports.File({ filename: "info.log", level: "info" }),
      new transports.Console(),
   ],
});

// Create a custom writable stream class
class LoggerStream extends Writable {
   _write(chunk: any, encoding: string, callback: Function) {
      logger.info(chunk.toString().trim());
      callback();
   }
}

const stream = new LoggerStream();

export { logger, stream };
