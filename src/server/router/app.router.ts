import { createRouter } from "../createRouter";
import { threadsRouter } from "./threads.router";
import { userRouter } from "./user.router";

export const appRouter = createRouter()
    .merge("threads.", threadsRouter)
    .merge("users", userRouter);

export type AppRouter = typeof appRouter;
