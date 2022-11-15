import { createRouter } from "../createRouter";
import { advocateRouter } from "./advocate/advocate.router";
import { argumentsRouter } from "./arguments.router";
import { articleRouter } from "./article.router";
import { commentsRouter } from "./comments.router";
import { navigationRouter } from "./navigation.router";
import { reportRouter } from "./report.router";
import { userRouter } from "./user.router";

export const appRouter = createRouter()
    .merge("articles.", articleRouter)
    .merge("arguments.", argumentsRouter)
    .merge("comments.", commentsRouter)
    .merge("navigation.", navigationRouter)
    .merge("users.", userRouter)
    .merge("report.", reportRouter)
    .merge("advocate.", advocateRouter);

export type AppRouter = typeof appRouter;
