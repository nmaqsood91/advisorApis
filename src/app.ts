import express from "express";
import logger from "morgan";
import cors from "cors";
import appRouter from "./routes/v1";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(logger("dev"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1", appRouter);
appRouter.use(errorHandler);

export default app;
