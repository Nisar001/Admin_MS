import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./core/db";
import router from "./app.routes";
import morgan from "morgan";
import { logger, stream } from "./logger";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(morgan("combined", { stream }));

ConnectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use("/api/v1", router);

app.use((req: Request, res: Response, next: NextFunction) => {
   logger.info(`API hit: ${req.method} ${req.url}`);
   next();
});

app.listen(port, () => {
   logger.info(`Server is running on port: ${port}`.bgCyan.white);
});

