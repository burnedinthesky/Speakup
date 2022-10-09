import { createRouter } from "../createRouter";
import { fetchTGFirstComment, Stances } from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";

export const threadGroupsRouter = createRouter().query("wFirstComment", {
    input: fetchTGFirstComment,
    async resolve({ input, ctx }) {
        const allowedStance = [];
        if (input.stance == "sup" || input.stance == "both")
            allowedStance.push("sup");
        if (input.stance == "agn" || input.stance == "both")
            allowedStance.push("agn");
        if (input.stance == "both") allowedStance.push("neu");

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
            if (element.leadComment == null)
                throw new Error("Error: lead comment is null");
            const newObj = {
                id: element.id,
                leadComment: {
                    id: element.leadComment.id,
                    author: element.leadComment.owner,
                    isOwner: true,
                    message: element.leadComment.content,
                    stance: element.leadComment.stance as Stances,
                    leadsThread: element.id,
                    threadReplies: element._count.comments,
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
