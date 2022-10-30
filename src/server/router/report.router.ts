import { createRouter } from "../createRouter";
import { z } from "zod";

import { TRPCError } from "@trpc/server";

export const reportRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                ...ctx,
                user: ctx.user,
            },
        });
    })
    .mutation("submitReport", {
        input: z.object({
            type: z.enum(["article", "argument", "comment"]),
            identifier: z.number().or(z.string()),
            reasons: z.array(z.string()),
        }),
        async resolve({ input, ctx }) {
            if (input.type === "article") {
                if (typeof input.identifier === "number")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Bad Identifier Type",
                    });
                const id = input.identifier as string;
                await ctx.prisma.articleReports.upsert({
                    where: {
                        userId_articlesId: {
                            userId: ctx.user.id,
                            articlesId: id,
                        },
                    },
                    create: {
                        article: { connect: { id: id } },
                        user: { connect: { id: ctx.user.id } },
                        reasons: input.reasons,
                    },
                    update: {
                        reasons: input.reasons,
                    },
                });
            } else if (input.type === "argument") {
                if (typeof input.identifier === "string")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Bad Identifier Type",
                    });
                const id = input.identifier as number;
                await ctx.prisma.argumentReports.upsert({
                    where: {
                        userId_argumentId: {
                            userId: ctx.user.id,
                            argumentId: id,
                        },
                    },
                    create: {
                        argument: { connect: { id: id } },
                        user: { connect: { id: ctx.user.id } },
                        reasons: input.reasons,
                    },
                    update: { reasons: input.reasons },
                });
            } else if (input.type === "comment") {
                if (typeof input.identifier === "string")
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Bad Identifier Type",
                    });
                const id = input.identifier as number;
                await ctx.prisma.commentReports.upsert({
                    where: {
                        userId_commentsId: {
                            userId: ctx.user.id,
                            commentsId: id,
                        },
                    },
                    create: {
                        comment: { connect: { id: id } },
                        user: { connect: { id: ctx.user.id } },
                        reasons: input.reasons,
                    },
                    update: { reasons: input.reasons },
                });
            }
            return true;
        },
    });
