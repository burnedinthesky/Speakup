import { z } from "zod";
import { ToModComments } from "../../../types/advocate/comments.types";
import { avcProcedure, router } from "../../trpc";

export const commentsRouter = router({
    fetchArticleComments: avcProcedure
        .input(
            z.object({
                id: z.string(),
                limit: z.number().min(1).max(100).nullish(),
                cursor: z
                    .object({
                        arguments: z.number().nullable(),
                        comments: z.number().nullable(),
                    })
                    .nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const reportThreshold = 0;

            const limit = input.limit ?? 12;

            let argCur: number | null, cmtCur: number | null;
            if (input.cursor === undefined || input.cursor === null) {
                argCur = 0;
                cmtCur = 0;
            } else {
                argCur = input.cursor.arguments;
                cmtCur = input.cursor.comments;
            }

            let reportedArgs, reportedCmts;
            let nextArgCur = null,
                nextCmtCur = null;

            if (argCur !== null) {
                const argReports = await ctx.prisma.argumentReports.groupBy({
                    by: ["argumentId"],
                    where: {
                        argument: { articleId: input.id, deleted: false },
                    },
                    _count: { userId: true },
                    having: { userId: { _count: { gt: reportThreshold } } },
                });

                reportedArgs = await ctx.prisma.argument.findMany({
                    where: {
                        id: {
                            in: argReports.map((report) => report.argumentId),
                        },
                    },
                    orderBy: { createdTime: "asc" },
                    select: {
                        id: true,
                        content: true,
                        createdTime: true,
                    },
                    take: limit + 1,
                    skip: argCur * limit,
                });

                reportedArgs = reportedArgs.map(
                    (arg) =>
                        ({
                            id: arg.id,
                            content: arg.content,
                            daysRemaining:
                                7 -
                                (new Date().getDate() -
                                    arg.createdTime.getDate()),
                            reportedReasons: [],
                            type: "argument",
                        } as ToModComments)
                );

                if (reportedArgs.length > limit) {
                    reportedArgs.pop();
                    nextArgCur = argCur + 1;
                }
            }
            if (cmtCur !== null) {
                const cmtReports = await ctx.prisma.commentReports.groupBy({
                    by: ["commentsId"],
                    where: {
                        comment: {
                            inArgument: { articleId: input.id },
                            deleted: false,
                        },
                    },
                    _count: { userId: true },
                    having: { userId: { _count: { gt: reportThreshold } } },
                });

                reportedCmts = await ctx.prisma.comments.findMany({
                    where: {
                        id: {
                            in: cmtReports.map((report) => report.commentsId),
                        },
                    },
                    orderBy: { createdTime: "asc" },
                    select: {
                        id: true,
                        content: true,
                        createdTime: true,
                        inArgument: {
                            select: { id: true, content: true },
                        },
                    },
                    take: limit + 1,
                    skip: cmtCur * limit,
                });

                reportedCmts = reportedCmts.map(
                    (cmt) =>
                        ({
                            id: cmt.id,
                            content: cmt.content,
                            daysRemaining:
                                7 -
                                (new Date().getDate() -
                                    cmt.createdTime.getDate()),
                            reportedReasons: [],
                            type: "comment",
                            argument: cmt.inArgument,
                        } as ToModComments)
                );

                if (reportedCmts.length > limit) {
                    reportedCmts.pop();
                    nextArgCur = cmtCur + 1;
                }
            }

            return {
                data: {
                    arguments: reportedArgs,
                    comments: reportedCmts,
                },
                nextCursor:
                    nextArgCur === null && nextCmtCur === null
                        ? undefined
                        : {
                              arguments: nextArgCur,
                              comments: nextCmtCur,
                          },
            };
        }),

    clearCommentReports: avcProcedure
        .input(
            z.object({
                id: z.number(),
                type: z.enum(["argument", "comment"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (input.type === "argument") {
                await ctx.prisma.argument.findFirstOrThrow({
                    where: {
                        id: input.id,
                        article: { author: { id: ctx.user.id } },
                    },
                });
                await ctx.prisma.argumentReports.deleteMany({
                    where: { argumentId: input.id },
                });
                return true;
            }
            await ctx.prisma.comments.findFirstOrThrow({
                where: {
                    id: input.id,
                    inArgument: {
                        article: { authorId: ctx.user.id },
                    },
                },
            });
            await ctx.prisma.commentReports.deleteMany({
                where: { commentsId: input.id },
            });
            return true;
        }),

    deleteComment: avcProcedure
        .input(
            z.object({
                id: z.number(),
                type: z.enum(["argument", "comment"]),
                reasons: z.array(z.string()),
                instance: z.enum(["first", "second"]),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const instance = input.instance.toUpperCase() as "FIRST" | "SECOND";

            if (input.type === "argument") {
                await ctx.prisma.argument.findFirstOrThrow({
                    where: {
                        id: input.id,
                        article: { author: { id: ctx.user.id } },
                    },
                });
                await ctx.prisma.argument.update({
                    where: { id: input.id },
                    data: {
                        deleted: true,
                    },
                });
                await ctx.prisma.argumentModAction.create({
                    data: {
                        argumentId: input.id,
                        instance: instance,
                        reason: input.reasons,
                    },
                });
                return true;
            }
            await ctx.prisma.comments.findFirstOrThrow({
                where: {
                    id: input.id,
                    inArgument: {
                        article: { author: { id: ctx.user.id } },
                    },
                },
            });
            await ctx.prisma.comments.update({
                where: { id: input.id },
                data: {
                    deleted: true,
                },
            });
            await ctx.prisma.commentModAction.create({
                data: {
                    commentsId: input.id,
                    instance: instance,
                    reason: input.reasons,
                },
            });
            return true;
        }),

    reportReasons: avcProcedure
        .input(
            z.object({
                id: z.number(),
                type: z.enum(["argument", "comment"]),
            })
        )
        .query(async ({ ctx, input }) => {
            let reasons;
            if (input.type === "argument") {
                await ctx.prisma.argument.findFirstOrThrow({
                    where: {
                        id: input.id,
                        article: { authorId: ctx.user.id },
                    },
                });

                reasons = await ctx.prisma.argumentReports.groupBy({
                    by: ["reasons"],
                    where: {
                        argumentId: input.id,
                    },
                    _count: {
                        userId: true,
                    },
                });
            } else {
                await ctx.prisma.comments.findFirstOrThrow({
                    where: {
                        id: input.id,
                        inArgument: { article: { authorId: ctx.user.id } },
                    },
                });

                reasons = await ctx.prisma.commentReports.groupBy({
                    by: ["reasons"],
                    where: {
                        commentsId: input.id,
                    },
                    _count: {
                        userId: true,
                    },
                });
            }

            let totalReports = 0;
            let other = 100;
            const reasonCount: { [key: string]: number } = {};
            reasons.forEach((reason) => {
                totalReports += reason._count.userId;
                reason.reasons.forEach((r) => {
                    if (!(r in reasonCount)) {
                        reasonCount[r] = 0;
                    }
                    reasonCount[r]++;
                });
            });

            const ret: { reason: string; percentage: number }[] = [];
            Object.keys(reasonCount).forEach((key) => {
                let percentage = Math.round(
                    ((reasonCount[key] as number) / totalReports) * 100
                );
                ret.push({
                    reason: key,
                    percentage,
                });
                other -= percentage;
            });
            ret.push({ reason: "other", percentage: other });

            return ret
                .filter((ele) => ele.percentage > 5)
                .sort((a, b) => a.percentage - b.percentage);
        }),

    fetchCommentThread: avcProcedure
        .input(
            z.object({
                argId: z.number().nullable(),
                commentId: z.number().nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            if (input.argId === null || input.commentId === null) return null;

            const argument = await ctx.prisma.argument.findUniqueOrThrow({
                where: { id: input.argId },
                select: { id: true, content: true },
            });
            const comments = await ctx.prisma.comments.findMany({
                where: { inArgumentId: input.argId },
                select: { content: true, id: true },
                orderBy: { createdTime: "asc" },
            });
            return {
                argument: argument,
                comments: comments,
            };
        }),
});
