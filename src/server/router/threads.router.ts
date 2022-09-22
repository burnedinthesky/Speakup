import { createRouter } from "../createRouter";
import {
    Comment,
    createThreadSchema,
    fetchThreadCommentsSchema,
    Stances,
} from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";

export const threadsRouter = createRouter()
    .mutation("createThread", {
        input: createThreadSchema,
        async resolve({ input, ctx }) {
            const createdThread = await ctx.prisma.threads.create({
                data: {
                    leadComment: {
                        create: {
                            content: input.content,
                            stance: input.stance,
                            owner: {
                                connect: {
                                    id: SampleUser.id,
                                },
                            },
                        },
                    },
                    threadGroup: {
                        connect: {
                            id: input.threadGroupId,
                        },
                    },
                },
                select: {
                    leadComment: {
                        select: {
                            id: true,
                            content: true,
                            owner: {
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
                            likedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                            supportedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                            dislikedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                        },
                    },
                    id: true,
                    pagnationSequence: true,
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            });

            return {
                id: createdThread.id,
                leadComment: {
                    id: createdThread.leadComment.id,
                    author: createdThread.leadComment.owner,
                    isOwner: true,
                    message: createdThread.leadComment.content,
                    stance: createdThread.leadComment.stance as Stances,
                    leadsThread: createdThread.id,
                    threadReplies: createdThread._count.comments,
                    likes: createdThread.leadComment._count.likedUsers,
                    userLiked: createdThread.leadComment.likedUsers.length == 1,
                    support: createdThread.leadComment._count.supportedUsers,
                    userSupported:
                        createdThread.leadComment.supportedUsers.length == 1,
                    dislikes: createdThread.leadComment._count.dislikedUsers,
                    userDisliked:
                        createdThread.leadComment.dislikedUsers.length == 1,
                },
            };
        },
    })
    .query("getThreadComments", {
        input: fetchThreadCommentsSchema,
        async resolve({ input, ctx }) {
            const data = await ctx.prisma.threads.findUniqueOrThrow({
                where: {
                    id: input.threadId,
                },
                select: {
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            owner: {
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
                            likedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                            supportedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                            dislikedUsers: {
                                where: {
                                    userId: SampleUser.id,
                                },
                            },
                            leadingThread: {
                                select: {
                                    id: true,
                                    _count: {
                                        select: {
                                            comments: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: {
                            createdTime: "asc",
                        },
                        cursor: input.cursor ? { id: input.cursor } : undefined,
                        take: input.limit + 1,
                    },
                },
            });
            let nextCursor: number | undefined = undefined;
            const comments = data.comments;
            if (comments.length == input.limit + 1) {
                const lastItem = comments.pop();
                nextCursor = lastItem?.id;
            }

            const retData: Comment[] = comments.map((comment) => {
                const leadThread = comment.leadingThread?.id;

                const obj: Comment = {
                    id: comment.id,
                    author: comment.owner,
                    isOwner: comment.owner.id == SampleUser.id,
                    message: comment.content,
                    stance: comment.stance as Stances,
                    leadsThread: leadThread,
                    threadReplies: comment.leadingThread?._count.comments,
                    likes: comment._count.likedUsers,
                    userLiked: comment.likedUsers.length == 1,
                    support: comment._count.supportedUsers,
                    userSupported: comment.supportedUsers.length == 1,
                    dislikes: comment._count.dislikedUsers,
                    userDisliked: comment.dislikedUsers.length == 1,
                };
                return obj;
            });

            return {
                retData,
                nextCursor,
            };
        },
    });
