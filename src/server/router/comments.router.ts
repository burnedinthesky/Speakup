import { createRouter } from "../createRouter";
import {
    createCommentSchema,
    deleteCommentSchema,
    Stances,
} from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";
import * as trpc from "@trpc/server";

export const commentsRouter = createRouter()
    .mutation("createComment", {
        input: createCommentSchema,
        async resolve({ input, ctx }) {
            const comment = await ctx.prisma.comments.create({
                data: {
                    content: input.content,
                    owner: {
                        connect: {
                            id: SampleUser.id,
                        },
                    },
                    stance: input.stance,
                },
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
            });

            return {
                id: comment.id,
                author: comment.owner,
                isOwner: true,
                message: comment.content,
                stance: comment.stance as Stances,
                leadsThread: undefined,
                threadReplies: undefined,
                likes: comment._count.likedUsers,
                userLiked: comment.likedUsers.length == 1,
                support: comment._count.supportedUsers,
                userSupported: comment.supportedUsers.length == 1,
                dislikes: comment._count.dislikedUsers,
                userDisliked: comment.dislikedUsers.length == 1,
            };
        },
    })
    .mutation("deleteComment", {
        input: deleteCommentSchema,
        async resolve({ input, ctx }) {
            await ctx.prisma.comments.delete({
                where: {
                    id: input.id,
                },
            });

            return;
        },
    });
