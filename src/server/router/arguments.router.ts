import { createRouter } from "../createRouter";
import { Argument, Stances } from "../../types/comments.types";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { prisma } from "../../utils/prisma";
import { ArgumentThread, User } from "@prisma/client";

const appendArticleUpdate = async (id: string) => {
    await prisma.articles.update({
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

export const argumentsRouter = createRouter()
    .mutation("createArgument", {
        input: z.object({
            articleId: z.string(),
            content: z.string(),
            stance: z.enum(["sup", "agn", "neu"]),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
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
                        select: { id: true, name: true, profileImg: true },
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

            await appendArticleUpdate(input.articleId);

            return formatIntoArgument(arg, ctx.user.id);
        },
    })
    .query("getArticleArguments", {
        input: z.object({
            articleId: z.string(),
            stance: z.enum(["sup", "agn", "both"]),
            sort: z.enum(["default", "time", "replies"]),
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }),
        async resolve({ input, ctx }) {
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
                        select: { id: true, name: true, profileImg: true },
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
        },
    })
    .mutation("updateArgumentInteraction", {
        input: z.object({
            id: z.number(),
            status: z.enum(["liked", "supported", "disliked"]).nullable(),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
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
                },
            });

            await appendArticleUpdate(updatedArg.articleId);

            return;
        },
    })
    .mutation("deleteArgument", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
            const arg = await ctx.prisma.argument.findMany({
                where: {
                    id: input.id,
                    authorId: ctx.user.id,
                },
            });

            if (arg.length < 1) throw new TRPCError({ code: "FORBIDDEN" });

            await ctx.prisma.argument.delete({
                where: {
                    id: input.id,
                },
            });

            return;
        },
    })
    .mutation("createNewThread", {
        input: z.object({
            argumentId: z.number(),
            name: z.string().min(2).max(8),
            updatingComments: z.array(z.number()),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
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
        },
    })
    .mutation("updateThread", {
        input: z.object({
            threadId: z.number(),
            name: z.string().min(2).max(8),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
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
        },
    })
    .mutation("deleteThread", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
            await ctx.prisma.argumentThread.delete({
                where: {
                    id: input.id,
                },
            });

            return;
        },
    });
