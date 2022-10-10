import { createRouter } from "../createRouter";
import { argumentsRouter } from "./arguments.router";
import { commentsRouter } from "./comments.router";

export const appRouter = createRouter()
    .merge("arguments.", argumentsRouter)
    .merge("comments.", commentsRouter);

export type AppRouter = typeof appRouter;
