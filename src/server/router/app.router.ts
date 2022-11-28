import { router } from "../trpc";
import { advocateRouter } from "./advocate/advocate.router";
import { argumentsRouter } from "./arguments.router";
import { articleRouter } from "./article.router";
import { commentsRouter } from "./comments.router";
import { navigationRouter } from "./navigation.router";
import { reportRouter } from "./report.router";
import { userRouter } from "./user.router";

export const appRouter = router({
    advocate: advocateRouter,
    articles: articleRouter,
    arguments: argumentsRouter,
    comments: commentsRouter,
    navigation: navigationRouter,
    report: reportRouter,
    users: userRouter,
});

export type AppRouter = typeof appRouter;
