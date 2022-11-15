import { createRouter } from "../createRouter";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { algoliaSearch, articleIndex } from "../../utils/algolia";
import { ArticleBlock, ArticleTagSlugsToVals } from "../../types/article.types";
import {
    CollectionSet,
    HomeRecommendations,
    NavCardData,
} from "../../types/navigation.types";

import { TRPCError } from "@trpc/server";

const processArticles = (
    articles: {
        author: {
            name: string;
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
    .middleware(async ({ ctx, next }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                ...ctx,
                user: ctx.user,
            },
        });
    })
    .query("home", {
        async resolve({ ctx }) {
            let userPrefs = ctx.user.tagPreference as {
                slug: string;
                pref: number;
            }[];

            userPrefs = userPrefs.map((ele) => ({
                ...ele,
                pref: ele.pref ** 2,
            }));

            let takeTags: { slug: string; pref: number }[] = [];

            for (let i = 0; i < 8; i++) {
                let totalSum = 0;
                userPrefs.forEach((tag) => {
                    totalSum += tag.pref;
                });

                let targetTagCount = Math.random() * totalSum;
                let curCounter = 0;
                let tagSlug: string = "";

                userPrefs.forEach((tag) => {
                    curCounter += tag.pref;
                    if (targetTagCount >= 0 && curCounter > targetTagCount) {
                        takeTags.push({
                            slug: tag.slug,
                            pref: tag.pref,
                        });
                        tagSlug = tag.slug;
                        targetTagCount = -1;
                    }
                });

                userPrefs = userPrefs.filter((pref) => pref.slug !== tagSlug);
            }

            takeTags = takeTags.sort((a, b) => (a.pref > b.pref ? -1 : 1));

            let takeTagVals = takeTags.map(
                (ele) => ArticleTagSlugsToVals[ele.slug] as string
            );

            const orderBy = Math.round(Math.random() * 4);

            let fetchedArticles = await ctx.prisma.articles.findMany({
                where: { tags: { hasSome: takeTagVals } },
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    author: {
                        select: { name: true, profileImg: true },
                    },
                    content: true,
                    viewCount: true,
                    _count: { select: { arguments: true } },
                },
                orderBy: {
                    arguments: orderBy === 0 ? { _count: "desc" } : undefined,
                    articleScore: orderBy === 1 ? "desc" : undefined,
                    createdTime: orderBy === 2 ? "desc" : undefined,
                    viewCount: orderBy === 3 ? "desc" : undefined,
                    articleReports:
                        orderBy === 4 ? { _count: "asc" } : undefined,
                },
                take: 50,
            });

            const ret: HomeRecommendations = {
                recommended: {
                    title: "為您推薦",
                    cards: [],
                },
            };
            let hasTags = 0;

            for (let i = 0; i < 8 && hasTags < 4; i++) {
                let tag = takeTagVals[i] as string;
                let articlesWithTag = fetchedArticles.filter((article) =>
                    article.tags.includes(tag)
                );
                if (!articlesWithTag.length) continue;
                hasTags++;
                ret[tag] = {
                    title: tag,
                    cards: processArticles(articlesWithTag),
                };
                ret["recommended"]?.cards.push(
                    processArticles(articlesWithTag)[0] as NavCardData
                );
                fetchedArticles = fetchedArticles.filter(
                    (article) => !article.tags.includes(tag)
                );
            }

            return ret;
        },
    })
    .query("search", {
        input: z.object({
            keyword: z.string().nullable(),
            tags: z.array(z.string()).nullable(),
            onPage: z.number().min(1).nullable(),
        }),
        async resolve({ ctx, input }) {
            const page = input.onPage ? input.onPage - 1 : 0;

            let keyword: string | null | undefined = input.keyword;
            if (!input.keyword) keyword = input.tags?.join("");
            if (!keyword)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Keyword & Tags not provided",
                });

            const result = await articleIndex.search(keyword, {
                attributesToRetrieve: ["objectID"],
                hitsPerPage: 20,
                page: page,
                filters: input.tags?.map((ele) => `tags:${ele}`).join(" OR "),
            });

            const hitIDs = result.hits.map((ele) => ele.objectID);
            const hasPages = result.nbPages;

            const articles = await ctx.prisma.articles.findMany({
                where: {
                    id: { in: hitIDs },
                },
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    author: {
                        select: {
                            name: true,
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
                hasPages: hasPages,
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
                    userId: ctx.user.id,

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
                                    name: true,
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
                    userId: ctx.user.id,
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
            const currectCollection = await ctx.prisma.collections.findUnique({
                where: {
                    articleId_userId: {
                        userId: ctx.user.id,
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
                    ? users[0]?.userId !== ctx.user.id
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
                        userId: ctx.user.id,
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
                            id: ctx.user.id,
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
                                    name: true,
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
            await ctx.prisma.collections.deleteMany({
                where: {
                    user: {
                        id: ctx.user.id,
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
                    userId: ctx.user.id,
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
                            id: ctx.user.id,
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
                        id: ctx.user.id,
                    },
                },
            });
            return;
        },
    });
