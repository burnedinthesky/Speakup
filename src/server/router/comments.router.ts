import { createRouter } from "../createRouter";
import { Comment, Stances } from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";
import * as trpc from "@trpc/server";
import { z } from "zod";

export const commentsRouter = createRouter()
    .mutation("createComment", {
        input: z.object({
            content: z.string(),
            stance: z.enum(["sup", "agn", "neu"]),
            argument: z.number(),
            thread: z.number().nullable(),
        }),
        async resolve({ input, ctx }) {
            const comment = await ctx.prisma.comments.create({
                data: {
                    inArgument: {
                        connect: {
                            id: input.argument,
                        },
                    },
                    inThread: input.thread
                        ? {
                              connect: {
                                  id: input.thread,
                              },
                          }
                        : undefined,
                    content: input.content,
                    author: {
                        connect: {
                            id: SampleUser.id,
                        },
                    },
                    stance: input.stance,
                },
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImg: true,
                        },
                    },
                    stance: true,
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                        },
                    },
                    inThread: {
                        select: {
                            id: true,
                            name: true,
                            argumentId: true,
                        },
                    },
                    likedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    supportedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    dislikedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                },
            });

            return {
                id: comment.id,
                author: comment.author,
                isAuthor: true,
                content: comment.content,
                stance: comment.stance as Stances,
                thread: comment.inThread,
                likes: comment._count.likedUsers,
                userLiked: comment.likedUsers.length == 1,
                support: comment._count.supportedUsers,
                userSupported: comment.supportedUsers.length == 1,
                dislikes: comment._count.dislikedUsers,
                userDisliked: comment.dislikedUsers.length == 1,
            } as Comment;
        },
    })
    .query("getArgumentComments", {
        input: z.object({
            argumentId: z.number(),
            stance: z.enum(["sup", "agn", "both"]),
            sort: z.string(),
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }),
        async resolve({ input, ctx }) {
            const allowedStance = [];
            if (input.stance == "sup" || input.stance == "both")
                allowedStance.push("sup");
            if (input.stance == "agn" || input.stance == "both")
                allowedStance.push("agn");
            if (input.stance == "both") allowedStance.push("neu");

            const data = await ctx.prisma.comments.findMany({
                where: {
                    inArgumentId: input.argumentId,
                    stance: {
                        in: allowedStance,
                    },
                },
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImg: true,
                        },
                    },
                    stance: true,
                    inThread: {
                        select: {
                            id: true,
                            name: true,
                            argumentId: true,
                        },
                    },
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                        },
                    },
                    likedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    supportedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    dislikedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                },
                orderBy: {
                    id: "asc",
                },
                cursor: input.cursor ? { id: input.cursor } : undefined,
                take: input.limit + 1,
            });
            let nextCursor: number | undefined = undefined;
            if (data.length == input.limit + 1) {
                const lastItem = data.pop();
                nextCursor = lastItem?.id;
            }

            const retData = data.map(
                (element) =>
                    ({
                        id: element.id,
                        author: element.author,
                        isAuthor: element.author.id === SampleUser.id,
                        content: element.content,
                        stance: element.stance as Stances,
                        thread: element.inThread,
                        likes: element._count.likedUsers,
                        userLiked: element.likedUsers.length == 1,
                        support: element._count.supportedUsers,
                        userSupported: element.supportedUsers.length == 1,
                        dislikes: element._count.dislikedUsers,
                        userDisliked: element.dislikedUsers.length == 1,
                    } as Comment)
            );
            return {
                retData,
                nextCursor,
            };
        },
    })
    .query("getThreadComments", {
        input: z.object({
            argumentId: z.number(),
            threadId: z.number().nullable(),
        }),
        async resolve({ input, ctx }) {
            if (input.threadId == null) return;

            const data = await ctx.prisma.comments.findMany({
                where: {
                    inArgumentId: input.argumentId,
                    inThread: {
                        id: input.threadId,
                    },
                },
                select: {
                    id: true,
                    content: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImg: true,
                        },
                    },
                    stance: true,
                    inThread: {
                        select: {
                            id: true,
                            name: true,
                            argumentId: true,
                        },
                    },
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                        },
                    },
                    likedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    supportedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                    dislikedUsers: {
                        where: {
                            id: SampleUser.id,
                        },
                    },
                },
                orderBy: {
                    id: "asc",
                },
            });

            const retData = data.map(
                (element) =>
                    ({
                        id: element.id,
                        author: element.author,
                        isAuthor: element.author.id === SampleUser.id,
                        content: element.content,
                        stance: element.stance as Stances,
                        thread: element.inThread,
                        likes: element._count.likedUsers,
                        userLiked: element.likedUsers.length == 1,
                        support: element._count.supportedUsers,
                        userSupported: element.supportedUsers.length == 1,
                        dislikes: element._count.dislikedUsers,
                        userDisliked: element.dislikedUsers.length == 1,
                    } as Comment)
            );
            return retData;
        },
    })
    .mutation("updateCommentsInteraction", {
        input: z.object({
            id: z.number(),
            status: z.enum(["liked", "supported", "disliked"]).nullable(),
        }),
        async resolve({ input, ctx }) {
            const originalComment = await ctx.prisma.comments.findUniqueOrThrow(
                {
                    where: {
                        id: input.id,
                    },
                    select: {
                        likedUsers: {
                            where: {
                                id: SampleUser.id,
                            },
                        },
                        supportedUsers: {
                            where: {
                                id: SampleUser.id,
                            },
                        },
                        dislikedUsers: {
                            where: {
                                id: SampleUser.id,
                            },
                        },
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
                id: SampleUser.id,
            };

            await ctx.prisma.comments.update({
                where: {
                    id: input.id,
                },
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
            });

            return;
        },
    })
    .mutation("deleteComment", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            await ctx.prisma.comments.delete({
                where: {
                    id: input.id,
                },
            });
            return;
        },
    });
