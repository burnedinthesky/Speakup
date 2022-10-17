import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ArticleBlock } from "../../schema/article.schema";
import {
    HomeRecommendations,
    NavCardData,
} from "../../schema/navigation.schema";
import { createRouter } from "../createRouter";

const processArticles = (
    articles: {
        author: {
            username: string;
            profileImg: string | null;
        };
        tags: string[];
        _count: {
            arguments: number;
        };
        id: string;
        title: string;
        content: Prisma.JsonValue;
        viewCount: number;
    }[]
) =>
    articles.map((ele) => {
        const content = ele.content as ArticleBlock[];
        let brief = "",
            isParagraph = false;
        content.forEach((block) => {
            if (brief.length && isParagraph) return;
            if (!brief.length) {
                brief = block.content;
                isParagraph = block.type === "p";
            }
            if (block.type === "p" && !isParagraph) {
                brief = block.content;
            }
        });
        return {
            id: ele.id,
            title: ele.title,
            tags: ele.tags,
            author: ele.author,
            brief: brief,
            viewCount: ele.viewCount,
            argumentCount: ele._count.arguments,
        } as NavCardData;
    });

export const navigationRouter = createRouter()
    .query("home", {
        async resolve({ ctx }) {
            const articles = await ctx.prisma.articles.findMany({
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    author: {
                        select: {
                            username: true,
                            profileImg: true,
                        },
                    },
                    content: true,
                    viewCount: true,
                    _count: {
                        select: {
                            arguments: true,
                        },
                    },
                },
            });

            const processedArticles = processArticles(articles);

            const data: HomeRecommendations = {
                recommended: {
                    title: "為您推薦",
                    cards: [...processedArticles],
                },
                med: {
                    title: "讚喔",
                    cards: [...processedArticles],
                },
            };

            return data;
        },
    })
    .query("search", {
        input: z.object({
            keyword: z.string().nullable(),
            tags: z.array(z.string()).nullable(),
            onPage: z.number().min(1).nullable(),
        }),
        async resolve({ ctx, input }) {
            const page = input.onPage ? input.onPage : 1;

            const articles = await ctx.prisma.articles.findMany({
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    author: {
                        select: {
                            username: true,
                            profileImg: true,
                        },
                    },
                    content: true,
                    viewCount: true,
                    _count: {
                        select: {
                            arguments: true,
                        },
                    },
                },
            });

            const processedArticles = processArticles(articles);

            const data = [...processedArticles];

            return {
                data,
                hasPages: 2,
            };
        },
    });
