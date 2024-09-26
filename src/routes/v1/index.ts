import { Router } from "express";

import advisorRouter from "./advisor";
import productRouter from "./product";
import { deserializeUser } from "../../middleware";
import docsRouter from "./docs";

const appRouter = Router();

appRouter.use("/advisor", advisorRouter);
appRouter.use("/docs", docsRouter);

appRouter.use("/products", deserializeUser, productRouter);

export default appRouter;
