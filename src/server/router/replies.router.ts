import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import { createReplySchema, getReplies } from "../../schema/replies.schema";

export const repliesRouter = createRouter()
    // .mutation('create-reply', {
    //     input: createReplySchema,
    //     async resolve({ ctx, input }){
    //         if(!ctx.user){
    //             new trpc.TRPCError({
    //                 code: 'FORBIDDEN',
    //                 message: 'Cannot send reply while logged out.'
    //             })
    //         }
    //         const reply = await ctx.prisma.commentReply.create({
    //             data:{
    //                 ...input,
    //                 owner:{
    //                     connect:{
    //                         id: ctx.user?.id
    //                     }
    //                 }
    //             }
    //         })
    //         return reply
    //     }
    // })
    .query("get-replies", {
        input: getReplies,
        async resolve({ ctx, input }) {
            const articleComments = await ctx.prisma.comments.findMany({
                where: {
                    articleId: input.articleId,
                },
            });
            const motherComment = articleComments[input.motherCommentId];
            if (motherComment == null) {
                return new trpc.TRPCError({
                    code: "NOT_FOUND",
                });
            }
            return ctx.prisma.commentReply.findMany({
                where: {
                    id: input.motherCommentId,
                },
            });
        },
    });
