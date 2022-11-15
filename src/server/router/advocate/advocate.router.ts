import { TRPCError } from "@trpc/server";
import { createRouter } from "../../createRouter";
import { articleRouter } from "./article.router";
import { CheckAvcClearance } from "../../../types/advocate/user.types";

export const advocateRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        } else if (!CheckAvcClearance(ctx.user.role)) {
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
