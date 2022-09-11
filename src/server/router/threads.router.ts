import { createRouter } from "../createRouter";
import {
    fetchCommentsSchema,
    fetchTGFirstComment,
} from "../../schema/comments.schema";

export const threadsRouter = createRouter().query("tg.firstComment", {
    input: fetchTGFirstComment,
    async resolve({ input, ctx }) {
        const allowedStance = [];
        if (input.stance == "sup" || input.stance == "both")
            allowedStance.push("sup");
        if (input.stance == "agn" || input.stance == "both")
            allowedStance.push("agn");

        const reqUser = {
            id: "123",
        };

        console.log(allowedStance);

        console.log(await ctx.prisma.threads.findMany());

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

        console.log(data);

        const retData = data.map((element) => {
            const newObj = {
                id: element.id,
                leadComment: {
                    id: element.leadComment.id,
                    author: element.leadComment.owner,
                    isOwner: true,
                    message: element.leadComment.content,
                    stance: element.leadComment.stance,
                    replies: element._count.comments,
                    likes: element.leadComment._count.likedUsers,
                    userLiked: element.leadComment.likedUsers.length == 1,
                    support: element.leadComment._count.supportedUsers,
                    userSupported:
                        element.leadComment.supportedUsers.length == 1,
                    dislikes: element.leadComment._count.dislikedUsers,
                    userDisliked: element.leadComment.dislikedUsers.length == 1,
                },
            };

            return newObj;
        });

        return {
            retData,
            nextCursor,
        };
    },
});
