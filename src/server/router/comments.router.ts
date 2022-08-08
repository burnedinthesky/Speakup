import { createRouter } from "../createRouter";
import * as trpc from '@trpc/server';
import { createCommentsSchema, getComments } from "../../schema/comments.schema";

export const commentsRouter = createRouter()
    .mutation('create-comment', {
        input: createCommentsSchema, 
        async resolve({ ctx, input }){
            if (!ctx.user){
                new trpc.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Cannot comment while logged out'
                })
            }
            const comment = await ctx.prisma.comments.create({
                data:{
                    ...input,
                    owner: {
                        connect: {
                            id: ctx.user?.id,
                        }
                    }
                }
            })
            return comment
        }
    })
    .query('article-comments', {
        input: getComments,
        resolve ({ input, ctx }){
            return ctx.prisma.comments.findMany({
                where:{
                    articleId: input.articleId,
                    onside: input.onside
                }
            })
        }
    })