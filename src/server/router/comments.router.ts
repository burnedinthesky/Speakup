import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import {
    createCommentsSchema,
    getComments,
    createCommentsActionSchema,
} from "../../schema/comments.schema";

export const commentsRouter = createRouter();
// .mutation("create-comment", {
//     input: createCommentsSchema,
//     async resolve({ ctx, input }) {
//         if (!ctx.user) {
//             new trpc.TRPCError({
//                 code: "FORBIDDEN",
//                 message: "Cannot comment while logged out",
//             });
//         }
//         const comment = await ctx.prisma.comments.create({
//             data: {
//                 ...input,
//                 owner: {
//                     connect: {
//                         id: ctx.user?.id,
//                     },
//                 },
//             },
//         });
//         return comment;
//     },
// })
// .query("article-comments", {
//     input: getComments,
//     resolve({ input, ctx }) {
//         return ctx.prisma.comments.findMany({
//             where: {
//                 articleId: input.articleId,
//                 onside: input.onside,
//             },
//         });
//     },
// });
// .mutation('comment-action', {
//     input: createCommentsActionSchema,
//     async resolve({ ctx, input }){
//         if(!ctx.user){
//             new trpc.TRPCError({
//                 code: "FORBIDDEN",
//                 message: "User is logged out."
//             })
//         }
//         let likes: number = ctx.user.likedComments.length
//         let dislikes: number = ctx.user.dislikedComments.length
//         let supported: number = ctx.user.supportedComments.length
//         if (likes + dislikes + supported > 1){
//             return new trpc.TRPCError({
//                 code: "BAD_REQUEST",
//                 message: "Can only select one action in Supported/Liked/Disliked."
//             })
//         }
//         const comment = await ctx.prisma.comments.findUnique({
//             where: {
//                 id: input.commentId,
//             }
//         })
//         if(comment == null){
//             return new trpc.TRPCError({
//                 code: "NOT_FOUND",
//                 message: "Comment not found"
//             })
//         }
//         const updateCommentData = await ctx.prisma.comments.update({
//             where:{
//                 id: input.commentId
//             },
//             data:{
//                 likedUsers: comment.likedUsers.push(ctx.user)
//             }
//         })
//         return updateCommentData
//     }
// })
