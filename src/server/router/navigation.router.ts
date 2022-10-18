import { createRouter } from "../createRouter";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ArticleBlock } from "../../schema/article.schema";
import {
    CollectionSet,
    HomeRecommendations,
    NavCardData,
} from "../../schema/navigation.schema";
import { SampleUser } from "../../templateData/users";

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
    })
    .query("getUserCollections", {
        input: z.object({
            collectionSet: z.number().nullable(),
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }),
        async resolve({ ctx, input }) {
            const data = await ctx.prisma.collections.findMany({
                where: {
                    userId: SampleUser.id,

                    collectionSets: input.collectionSet
                        ? {
                              some: {
                                  id: input.collectionSet,
                              },
                          }
                        : undefined,
                },
                select: {
                    article: {
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
                    },
                },
                take: input.limit + 1,
                skip: input.cursor ? input.cursor * input.limit : 0,
            });

            let nextCursor: number | undefined;
            if (data.length === input.limit + 1) {
                nextCursor = input.cursor ? input.cursor + 1 : 1;
                data.pop();
            }
            console.log("here");
            return {
                data: processArticles(data.map((data) => data.article)),
                nextCursor,
            };
        },
    })
    .query("getSingleCollection", {
        input: z.object({
            articleId: z.string(),
        }),
        async resolve({ ctx, input }) {
            const data = await ctx.prisma.collections.findFirst({
                where: {
                    userId: SampleUser.id,
                    articleId: input.articleId,
                },
                select: {
                    id: true,
                    collectionSets: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            return data
                ? {
                      ...data,
                      collectionSets: data.collectionSets.map((ele) => ele.id),
                  }
                : null;
        },
    })
    .mutation("upsertUserCollection", {
        input: z.object({
            articleId: z.string(),
            collectionSetIds: z.array(z.number()),
        }),
        async resolve({ input, ctx }) {
            console.log("Updated");
            console.log(input.collectionSetIds);

            const currectCollection = await ctx.prisma.collections.findUnique({
                where: {
                    articleId_userId: {
                        userId: SampleUser.id,
                        articleId: input.articleId,
                    },
                },
                select: {
                    id: true,
                    collectionSets: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

            const users = await ctx.prisma.collectionSet.findMany({
                where: {
                    id: {
                        in: input.collectionSetIds,
                    },
                },
                select: {
                    userId: true,
                },
            });

            if (
                users.length > 1 || users.length
                    ? users[0]?.userId !== SampleUser.id
                    : false
            ) {
                throw new Error("Invalid Collection Sets");
            }

            let disconnect: { id: number }[] = [];
            if (currectCollection)
                currectCollection.collectionSets.forEach((ele) => {
                    if (!input.collectionSetIds.includes(ele.id)) {
                        disconnect.push({ id: ele.id });
                    }
                });

            const data = await ctx.prisma.collections.upsert({
                where: {
                    articleId_userId: {
                        articleId: input.articleId,
                        userId: SampleUser.id,
                    },
                },
                update: {
                    collectionSets: {
                        connect: input.collectionSetIds.map((ele) => ({
                            id: ele,
                        })),
                        disconnect: disconnect,
                    },
                },
                create: {
                    article: {
                        connect: {
                            id: input.articleId,
                        },
                    },
                    user: {
                        connect: {
                            id: SampleUser.id,
                        },
                    },
                    collectionSets: {
                        connect: input.collectionSetIds.map((ele) => ({
                            id: ele,
                        })),
                    },
                },
                select: {
                    article: {
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
                    },
                },
            });
            return processArticles([data.article])[0];
        },
    })
    .mutation("deleteUserCollection", {
        input: z.object({
            collectionId: z.number(),
        }),
        async resolve({ ctx, input }) {
            console.log("Updated");
            await ctx.prisma.collections.deleteMany({
                where: {
                    user: {
                        id: SampleUser.id,
                    },
                    id: input.collectionId,
                },
            });

            return;
        },
    })
    .query("getCollectionSets", {
        async resolve({ ctx }) {
            const sets = await ctx.prisma.collectionSet.findMany({
                where: {
                    userId: SampleUser.id,
                },
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    createdTime: "desc",
                },
            });

            return sets as CollectionSet[];
        },
    })
    .mutation("createCollectionSet", {
        input: z.object({
            name: z.string(),
        }),
        async resolve({ ctx, input }) {
            const createdSet = await ctx.prisma.collectionSet.create({
                data: {
                    user: {
                        connect: {
                            id: SampleUser.id,
                        },
                    },
                    name: input.name,
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            return createdSet as CollectionSet;
        },
    })
    .mutation("deleteCollectionSet", {
        input: z.object({
            colSetId: z.number(),
        }),
        async resolve({ ctx, input }) {
            await ctx.prisma.collectionSet.deleteMany({
                where: {
                    id: input.colSetId,
                    user: {
                        id: SampleUser.id,
                    },
                },
            });
            return;
        },
    });
