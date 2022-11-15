import { TRPCError } from "@trpc/server";
import { createRouter } from "../../createRouter";
import { articleRouter } from "./article.router";

export const advocateRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        const allowedRoles = ["ADVOCATE", "SENIOR_ADVOCATE", "ADMIN"];
        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        } else if (!allowedRoles.includes(ctx.user.role)) {
            throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({
            ctx: {
                ...ctx,
                user: ctx.user,
            },
        });
    })
    .merge("articles.", articleRouter);
