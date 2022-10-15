import { getSingleArticleSchema } from "../../schema/article.schema";
import { createRouter } from "../createRouter";

export const articleRouter = createRouter()
    .query("articles", {
        resolve({ ctx }) {
            return ctx.prisma.articles.findMany();
        },
    })
    .query("single-article", {
        input: getSingleArticleSchema,
        resolve({ input, ctx }) {
            return ctx.prisma.articles.findUnique({
                where: {
                    id: input.articleId,
                },
            });
        },
    });
