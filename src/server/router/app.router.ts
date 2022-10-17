import { createRouter } from "../createRouter";
import { argumentsRouter } from "./arguments.router";
import { articleRouter } from "./article.router";
import { commentsRouter } from "./comments.router";
import { navigationRouter } from "./navigation.router";

export const appRouter = createRouter()
    .merge("articles.", articleRouter)
    .merge("arguments.", argumentsRouter)
    .merge("comments.", commentsRouter)
    .merge("navigation.", navigationRouter);

export type AppRouter = typeof appRouter;
