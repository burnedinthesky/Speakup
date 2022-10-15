import { createRouter } from "../createRouter";
import { argumentsRouter } from "./arguments.router";
import { commentsRouter } from "./comments.router";
import { navigationRouter } from "./navigation.router";

export const appRouter = createRouter()
    .merge("arguments.", argumentsRouter)
    .merge("comments.", commentsRouter)
    .merge("navigation.", navigationRouter);

export type AppRouter = typeof appRouter;
