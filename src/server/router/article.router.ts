import { createArticleSchema, getSingleArticleSchema } from "../../schema/article.schema";
import { createRouter } from "../createRouter";
import * as trpc from '@trpc/server'

export const articleRouter = createRouter()
    .mutation('create-article', {
        input: createArticleSchema, 
        async resolve({ctx, input}) {
            if (!ctx.user){
                new trpc.TRPCError({
                    code: 'FORBIDDEN', 
                    message: 'Cannot create article while logged out.'
                })
            }
            const article = await ctx.prisma.articles.create({
                data:{
                    ...input, 
                    author:{
                        connect:{
                            id: ctx.user?.id,
                        }
                    }
                }
            })
            return article
        }
    })
    .query('articles', {
        resolve({ ctx }) {
            return ctx.prisma.articles.findMany()
        }
    })
    .query('single-article', {
        input: getSingleArticleSchema, 
        resolve({ input, ctx }){
            return ctx.prisma.articles.findUnique({
                where:{
                    id: input.articleId
                }
            })
        }
    })