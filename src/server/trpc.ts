/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { CheckAvcClearance } from "../types/advocate/user.types";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/v10/data-transformers
     */
    transformer: superjson,
    /**
     * @see https://trpc.io/docs/v10/error-formatting
     */
    errorFormatter({ shape }) {
        return shape;
    },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

const isLoggedIn = t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});

const isAdvocate = t.middleware(async ({ ctx, next }) => {
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
});

export const publicProcedure = t.procedure;
export const loggedInProcedure = t.procedure.use(isLoggedIn);
export const avcProcedure = t.procedure.use(isAdvocate);

export const middleware = t.middleware;
