import { createRouter } from "../createRouter";
import { Argument, Stances } from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";
import { z } from "zod";

export const argumentsRouter = createRouter()
    .mutation("createArgument", {
        input: z.object({
            articleId: z.string(),
            content: z.string(),
            stance: z.string().length(3),
        }),
        async resolve({ input, ctx }) {
            const argument = await ctx.prisma.argument.create({
                data: {
                    content: input.content,
                    author: {
                        connect: {
                            id: SampleUser.id,
                        },
                    },
                    article: {
                        connect: {
                            id: input.articleId,
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
                            comments: true,
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
                    argumentThreads: {
                        select: {
                            id: true,
                            name: true,
                            argumentId: true,
                        },
                    },
                },
            });

            return {
                id: argument.id,
                author: argument.author,
                isAuthor: argument.author.id === SampleUser.id,
                content: argument.content,
                stance: argument.stance as Stances,
                likes: argument._count.likedUsers,
                userLiked: argument.likedUsers.length == 1,
                support: argument._count.supportedUsers,
                userSupported: argument.supportedUsers.length == 1,
                dislikes: argument._count.dislikedUsers,
                userDisliked: argument.dislikedUsers.length == 1,
                hasComments: argument._count.comments > 0,
                threads: argument.argumentThreads,
            } as Argument;
        },
    })
    .query("getArticleArguments", {
        input: z.object({
            articleId: z.string(),
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

            const data = await ctx.prisma.argument.findMany({
                where: {
                    articleId: input.articleId,
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
                    _count: {
                        select: {
                            likedUsers: true,
                            supportedUsers: true,
                            dislikedUsers: true,
                            comments: true,
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
                    argumentThreads: {
                        select: {
                            id: true,
                            name: true,
                            argumentId: true,
                        },
                    },
                    pagnationSequence: true,
                },

                orderBy: {
                    pagnationSequence: "asc",
                },
                cursor: input.cursor
                    ? { pagnationSequence: input.cursor }
                    : undefined,
                take: input.limit + 1,
            });
            let nextCursor: number | undefined = undefined;
            if (data.length == input.limit + 1) {
                const lastItem = data.pop();
                nextCursor = lastItem?.pagnationSequence;
            }

            const retData = data.map(
                (element) =>
                    ({
                        id: element.id,
                        author: element.author,
                        isAuthor: element.author.id === SampleUser.id,
                        content: element.content,
                        stance: element.stance as Stances,
                        likes: element._count.likedUsers,
                        userLiked: element.likedUsers.length == 1,
                        support: element._count.supportedUsers,
                        userSupported: element.supportedUsers.length == 1,
                        dislikes: element._count.dislikedUsers,
                        userDisliked: element.dislikedUsers.length == 1,
                        hasComments: element._count.comments > 0,
                        threads: element.argumentThreads,
                    } as Argument)
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
            const originalComment = await ctx.prisma.argument.findUniqueOrThrow(
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

            await ctx.prisma.argument.update({
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
    .mutation("createNewThread", {
        input: z.object({
            argumentId: z.number(),
            name: z.string().min(2).max(8),
        }),
        async resolve({ input, ctx }) {
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

            return thread;
        },
    })
    .mutation("deleteArgument", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            await ctx.prisma.argument.delete({
                where: {
                    id: input.id,
                },
            });

            return;
        },
    });
