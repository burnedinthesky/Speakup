import { createRouter } from "../createRouter";
import {
    createCommentsSchema,
    fetchTGFirstComment,
    Stances,
} from "../../schema/comments.schema";

const reqUser = {
    id: "123",
};

export const threadsRouter = createRouter()
    .query("tg.firstComment", {
        input: fetchTGFirstComment,
        async resolve({ input, ctx }) {
            const allowedStance = [];
            if (input.stance == "sup" || input.stance == "both")
                allowedStance.push("sup");
            if (input.stance == "agn" || input.stance == "both")
                allowedStance.push("agn");

            const data = await ctx.prisma.threads.findMany({
                where: {
                    threadGroupId: input.TGID,
                    leadComment: {
                        stance: {
                            in: allowedStance,
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
                                    userId: reqUser.id,
                                },
                            },
                            supportedUsers: {
                                where: {
                                    userId: reqUser.id,
                                },
                            },
                            dislikedUsers: {
                                where: {
                                    userId: reqUser.id,
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

            const retData = data.map((element) => {
                const newObj = {
                    id: element.id,
                    leadComment: {
                        id: element.leadComment.id,
                        author: element.leadComment.owner,
                        isOwner: true,
                        message: element.leadComment.content,
                        stance: element.leadComment.stance as Stances,
                        leadsThread: element._count.comments > 0,
                        likes: element.leadComment._count.likedUsers,
                        userLiked: element.leadComment.likedUsers.length == 1,
                        support: element.leadComment._count.supportedUsers,
                        userSupported:
                            element.leadComment.supportedUsers.length == 1,
                        dislikes: element.leadComment._count.dislikedUsers,
                        userDisliked:
                            element.leadComment.dislikedUsers.length == 1,
                    },
                };

                return newObj;
            });

            return {
                retData,
                nextCursor,
            };
        },
    })
    .mutation("addComment", {
        input: createCommentsSchema,
        async resolve({ input, ctx }) {
            const createdComment = await ctx.prisma.threads.create({
                data: {
                    leadComment: {
                        create: {
                            content: input.content,
                            stance: input.stance,
                            owner: {
                                connect: {
                                    id: "0eed0262-564b-4b8a-997d-65c2026a5b0b",
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
                                    userId: reqUser.id,
                                },
                            },
                            supportedUsers: {
                                where: {
                                    userId: reqUser.id,
                                },
                            },
                            dislikedUsers: {
                                where: {
                                    userId: reqUser.id,
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
                id: createdComment.id,
                leadComment: {
                    id: createdComment.leadComment.id,
                    author: createdComment.leadComment.owner,
                    isOwner: true,
                    message: createdComment.leadComment.content,
                    stance: createdComment.leadComment.stance as Stances,
                    leadsThread: createdComment._count.comments > 0,
                    likes: createdComment.leadComment._count.likedUsers,
                    userLiked:
                        createdComment.leadComment.likedUsers.length == 1,
                    support: createdComment.leadComment._count.supportedUsers,
                    userSupported:
                        createdComment.leadComment.supportedUsers.length == 1,
                    dislikes: createdComment.leadComment._count.dislikedUsers,
                    userDisliked:
                        createdComment.leadComment.dislikedUsers.length == 1,
                },
            };
        },
    });
