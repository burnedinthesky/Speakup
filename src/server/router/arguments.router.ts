import { z } from "zod";
import { Argument, Stances } from "../../types/comments.types";

import { prisma } from "../../utils/prisma";
import { ArgumentThread, User } from "@prisma/client";
import { loggedInProcedure, publicProcedure, router } from "../trpc";
import { updateUserReputation } from "../lib/updateReputation";

const appendArticleUpdate = (id: string) => {
    return prisma.articles.update({
        where: { id },
        data: {
            requiresArgIndex: true,
        },
    });
};

interface argumentDBFormat {
    author: {
        id: string;
        name: string;
        profileImg: string | null;
        reputation: number;
    };
    content: string;
    stance: string;
    likedUsers: User[];
    dislikedUsers: User[];
    supportedUsers: User[];
    argumentThreads: ArgumentThread[];
    id: number;
    _count: {
        likedUsers: number;
        supportedUsers: number;
        dislikedUsers: number;
        comments: number;
    };
}

const formatIntoArgument = (
    dbInstance: argumentDBFormat,
    userId: string
): Argument => {
    return {
        id: dbInstance.id,
        author: dbInstance.author,
        isAuthor: dbInstance.author.id === userId,
        content: dbInstance.content,
        stance: dbInstance.stance as Stances,
        likes: dbInstance._count.likedUsers,
        userLiked: dbInstance.likedUsers.length == 1,
        support: dbInstance._count.supportedUsers,
        userSupported: dbInstance.supportedUsers.length == 1,
        dislikes: dbInstance._count.dislikedUsers,
        userDisliked: dbInstance.dislikedUsers.length == 1,
        hasComments: dbInstance._count.comments > 0,
        threads: dbInstance.argumentThreads,
    };
};

export const argumentsRouter = router({
    createArgument: loggedInProcedure
        .input(
            z.object({
                articleId: z.string(),
                content: z.string(),
                stance: z.enum(["sup", "agn", "neu"]),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const arg = await ctx.prisma.argument.create({
                data: {
                    content: input.content,
                    author: { connect: { id: ctx.user.id } },
                    article: { connect: { id: input.articleId } },
                    stance: input.stance,
                },
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profileImg: true,
                            reputation: true,
                        },
                    },
                    stance: true,
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                            comments: true,
                        },
                    },
                    likedUsers: { where: { id: ctx.user.id } },
                    supportedUsers: { where: { id: ctx.user.id } },
                    dislikedUsers: { where: { id: ctx.user.id } },
                    argumentThreads: {
                        select: { id: true, name: true, argumentId: true },
                    },
                },
            });

            await Promise.all([
                appendArticleUpdate(input.articleId),
                updateUserReputation({ userId: ctx.user.id, amount: 50 }),
            ]);

            return formatIntoArgument(arg, ctx.user.id);
        }),
    getArticleArguments: publicProcedure
        .input(
            z.object({
                articleId: z.string(),
                stance: z.enum(["sup", "agn", "both"]),
                sort: z.enum(["default", "time", "replies"]),
                limit: z.number().min(1).max(100),
                cursor: z.number().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const user = ctx.user
                ? ctx.user
                : {
                      id: "",
                  };

            const allowedStance = [];
            if (input.stance == "sup" || input.stance == "both")
                allowedStance.push("sup");
            if (input.stance == "agn" || input.stance == "both")
                allowedStance.push("agn");
            if (input.stance == "both") allowedStance.push("neu");

            let userArgs: any[] = [];

            if (!input.cursor) {
                userArgs = await ctx.prisma.argument.findMany({
                    where: {
                        articleId: input.articleId,
                        stance: { in: allowedStance },
                        authorId: { equals: user.id },
                        deleted: false,
                    },
                    select: {
                        id: true,
                        content: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                profileImg: true,
                            },
                        },
                        stance: true,
                        _count: {
                            select: {
                                likedUsers: true,
                                supportedUsers: true,
                                dislikedUsers: true,
                                comments: true,
                            },
                        },
                        likedUsers: { where: { id: user.id } },
                        supportedUsers: { where: { id: user.id } },
                        dislikedUsers: { where: { id: user.id } },
                        argumentThreads: {
                            select: {
                                id: true,
                                name: true,
                                argumentId: true,
                            },
                        },
                        pagnationSequence: true,
                    },

                    orderBy: { createdTime: "desc" },
                });
            }

            let data = await ctx.prisma.argument.findMany({
                where: {
                    articleId: input.articleId,
                    stance: { in: allowedStance },
                    NOT: { authorId: { equals: user.id } },
                },
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            profileImg: true,
                            reputation: true,
                        },
                    },
                    stance: true,
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                            comments: true,
                        },
                    },
                    likedUsers: { where: { id: user.id } },
                    supportedUsers: { where: { id: user.id } },
                    dislikedUsers: { where: { id: user.id } },
                    argumentThreads: {
                        select: { id: true, name: true, argumentId: true },
                    },
                    pagnationSequence: true,
                },

                orderBy: {
                    pagnationSequence:
                        input.sort === "default" ? "asc" : undefined,
                    createdTime: input.sort === "time" ? "desc" : undefined,
                    comments:
                        input.sort === "replies"
                            ? { _count: "desc" }
                            : undefined,
                },
                skip: input.limit * (input.cursor ? input.cursor : 0),
                take: input.limit + 1,
            });

            let nextCursor =
                data.length === input.limit + 1
                    ? (input.cursor ? input.cursor : 0) + 1
                    : undefined;

            if (data.length > input.limit) data.pop();

            data = userArgs.concat(data);

            const retData = data.map((element) =>
                formatIntoArgument(element, ctx.user ? ctx.user.id : "")
            );
            return {
                retData,
                nextCursor,
            };
        }),
    updateArgumentInteraction: loggedInProcedure
        .input(
            z.object({
                id: z.number(),
                status: z.enum(["liked", "supported", "disliked"]).nullable(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const originalComment = await ctx.prisma.argument.findUniqueOrThrow(
                {
                    where: { id: input.id },
                    select: {
                        likedUsers: { where: { id: ctx.user.id } },
                        supportedUsers: { where: { id: ctx.user.id } },
                        dislikedUsers: { where: { id: ctx.user.id } },
                    },
                }
            );

            const current = {
                liked: originalComment.likedUsers.length == 1,
                supported: originalComment.supportedUsers.length == 1,
                disliked: originalComment.dislikedUsers.length == 1,
            };

            let connect: ("liked" | "supported" | "disliked")[] = [],
                disconnect: ("liked" | "supported" | "disliked")[] = [];
            if (input.status == null || current[input.status]) {
                if (current.liked) disconnect.push("liked");
                if (current.supported) disconnect.push("supported");
                if (current.disliked) disconnect.push("disliked");
            } else {
                if (input.status == "liked") {
                    connect.push("liked");
                    if (current.supported) disconnect.push("supported");
                    if (current.disliked) disconnect.push("disliked");
                }
                if (input.status == "supported") {
                    connect.push("supported");
                    if (current.liked) disconnect.push("liked");
                    if (current.disliked) disconnect.push("disliked");
                }
                if (input.status == "disliked") {
                    connect.push("disliked");
                    if (current.liked) disconnect.push("liked");
                    if (current.supported) disconnect.push("supported");
                }
            }

            const UserObject = {
                id: ctx.user.id,
            };

            const updatedArg = await ctx.prisma.argument.update({
                where: { id: input.id },
                data: {
                    likedUsers: {
                        connect: connect.includes("liked")
                            ? UserObject
                            : undefined,
                        disconnect: disconnect.includes("liked")
                            ? UserObject
                            : undefined,
                    },
                    supportedUsers: {
                        connect: connect.includes("supported")
                            ? UserObject
                            : undefined,
                        disconnect: disconnect.includes("supported")
                            ? UserObject
                            : undefined,
                    },
                    dislikedUsers: {
                        connect: connect.includes("disliked")
                            ? UserObject
                            : undefined,
                        disconnect: disconnect.includes("disliked")
                            ? UserObject
                            : undefined,
                    },
                },
                select: {
                    articleId: true,
                    authorId: true,
                },
            });

            let updatedReputation = 0;
            if (
                !current.liked &&
                !current.supported &&
                connect.some((arg) => ["liked", "support"].includes(arg))
            )
                updatedReputation = 5;
            else if (
                (current.liked && disconnect.includes("liked")) ||
                (current.supported && disconnect.includes("supported"))
            )
                updatedReputation = -5;
            await Promise.all([
                appendArticleUpdate(updatedArg.articleId),
                updateUserReputation({
                    userId: updatedArg.authorId,
                    amount: updatedReputation,
                }),
            ]);

            return;
        }),
    deleteArgument: loggedInProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.argument.findFirstOrThrow({
                where: {
                    id: input.id,
                    authorId: ctx.user.id,
                },
            });

            await ctx.prisma.argument.delete({
                where: {
                    id: input.id,
                },
            });

            await updateUserReputation({
                userId: ctx.user.id,
                amount: -50,
            });

            return;
        }),
    createNewThread: loggedInProcedure
        .input(
            z.object({
                argumentId: z.number(),
                name: z.string().min(2).max(8),
                updatingComments: z.array(z.number()),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const thread = await ctx.prisma.argumentThread.create({
                data: {
                    argumentId: input.argumentId,
                    name: input.name,
                },
                select: {
                    id: true,
                    argumentId: true,
                    name: true,
                },
            });

            await ctx.prisma.comments.updateMany({
                where: {
                    id: {
                        in: input.updatingComments,
                    },
                },
                data: {
                    argumentThreadId: thread.id,
                },
            });

            return thread;
        }),
    updateThread: loggedInProcedure
        .input(
            z.object({
                threadId: z.number(),
                name: z.string().min(2).max(8),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const updated = await ctx.prisma.argumentThread.update({
                where: {
                    id: input.threadId,
                },
                data: {
                    name: input.name,
                },
                select: {
                    id: true,
                    argumentId: true,
                    name: true,
                },
            });

            return updated;
        }),
    deleteThread: loggedInProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            await ctx.prisma.argumentThread.delete({
                where: {
                    id: input.id,
                },
            });

            return;
        }),
});
