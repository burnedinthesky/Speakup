import { createRouter } from "../createRouter";
import { commentsRouter } from "./comments.router";
import { threadGroupsRouter } from "./threadgroup.router";
import { threadsRouter } from "./threads.router";
import { userRouter } from "./user.router";

export const appRouter = createRouter()
    .merge("threads.", threadsRouter)
    .merge("comments.", commentsRouter)
    .merge("threadgroups.", threadGroupsRouter)
    .merge("users", userRouter);

export type AppRouter = typeof appRouter;
