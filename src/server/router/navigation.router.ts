import { z } from "zod";
import { Prisma, UserTagPreference } from "@prisma/client";
import { articleIndex } from "../../utils/algolia";
import {
    ArticleTagSlugs,
    ArticleTagSlugsToVals,
    TypeArticleTagSlugs,
    TypeArticleTagValues,
} from "../../types/article.types";
import {
    CollectionSet,
    HomeRecommendations,
    NavCardData,
} from "../../types/navigation.types";

import { TRPCError } from "@trpc/server";
import { loggedInProcedure, router } from "../trpc";
import { randomObjectSelection } from "../../lib/rndObjSelection";
import { shuffle } from "lodash";

const processArticles = (
    articles: {
        author: {
            name: string;
            profileImg: string | null;
        };
        brief: string;
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
        return {
            id: ele.id,
            title: ele.title,
            tags: ele.tags,
            author: ele.author,
            brief: ele.brief,
            viewCount: ele.viewCount,
            argumentCount: ele._count.arguments,
        } as NavCardData;
    });

export const navigationRouter = router({
    home: loggedInProcedure.query(async ({ ctx }) => {
        let dbUserTagPref = ctx.user.tagPreference as UserTagPreference | null;

        if (dbUserTagPref === null)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "Failed to retrieve user tag preference, please contact Speakup support",
            });

        let userPrefs = (Object.keys(dbUserTagPref) as TypeArticleTagSlugs[])
            .filter((pref) => ArticleTagSlugs.includes(pref))
            .map((key) => ({
                slug: key,
                pref:
                    ((dbUserTagPref as UserTagPreference)[key] as number) **
                    1.5,
            }));

        let takeTags = randomObjectSelection<string>(
            userPrefs.map((pref) => pref.slug),
            8,
            userPrefs.map((pref) => pref.pref)
        );

        let takeTagVals = takeTags.map((ele) => ArticleTagSlugsToVals(ele));

        const orderBy = Math.round(Math.random() * 4);

        let fetchedArticles = await ctx.prisma.articles.findMany({
            where: { tags: { hasSome: takeTagVals } },
            select: {
                id: true,
                title: true,
                tags: true,
                brief: true,
                author: { select: { name: true, profileImg: true } },
                content: true,
                viewCount: true,
                _count: { select: { arguments: true } },
            },
            orderBy: {
                arguments: orderBy === 0 ? { _count: "desc" } : undefined,
                articleScore: orderBy === 1 ? "desc" : undefined,
                createdTime: orderBy === 2 ? "desc" : undefined,
                viewCount: orderBy === 3 ? "desc" : undefined,
                articleReports: orderBy === 4 ? { _count: "asc" } : undefined,
            },
            take: 50,
        });

        if (fetchedArticles.length === 0) {
            console.log("Refetch triggered");
            fetchedArticles = await ctx.prisma.articles.findMany({
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    brief: true,
                    author: { select: { name: true, profileImg: true } },
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
        }

        const ret: HomeRecommendations = {
            recommended: {
                title: "為您推薦",
                cards: [],
            },
        };

        userPrefs.forEach((pref) => {
            try {
                ArticleTagSlugsToVals(pref.slug);
            } catch {
                console.log(pref.slug);
            }
        });

        let tagsOrder = randomObjectSelection<TypeArticleTagValues>(
            userPrefs.map((pref) => ArticleTagSlugsToVals(pref.slug)),
            userPrefs.length,
            userPrefs.map((pref) => pref.pref)
        );

        let tagsIndex = 0;
        let hasTags = 0;

        console.log(tagsOrder);

        while (tagsIndex < userPrefs.length && hasTags < 4) {
            console.log(tagsIndex);
            console.log(tagsOrder[tagsIndex]);

            tagsIndex++;
            let tag = tagsOrder[tagsIndex] as string;
            let articlesWithTag = fetchedArticles.filter((article) => {
                return article.tags.includes(tag);
            });
            if (articlesWithTag.length === 0) continue;

            console.log("has tag ++");

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

        if (ret["recommended"]?.cards.length === 0)
            throw new Error("Recommendations failed to generate");

        return ret;
    }),
    search: loggedInProcedure
        .input(
            z.object({
                keyword: z.string().nullable(),
                tags: z.array(z.string()).nullable(),
                onPage: z.number().min(1).nullable(),
            })
        )
        .query(async ({ ctx, input }) => {
            const page = input.onPage ? input.onPage - 1 : 0;

            console.log(input.keyword);
            console.log(input.tags);

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
                where: { id: { in: hitIDs } },
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    brief: true,
                    author: { select: { name: true, profileImg: true } },
                    content: true,
                    viewCount: true,
                    _count: { select: { arguments: true } },
                },
            });

            const processedArticles = processArticles(articles);

            const data = [...processedArticles];

            return {
                data,
                hasPages: hasPages,
            };
        }),
    getUserCollections: loggedInProcedure
        .input(
            z.object({
                collectionSet: z.number().nullable(),
                limit: z.number().min(1).max(100),
                cursor: z.number().nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.prisma.collections.findMany({
                where: {
                    userId: ctx.user.id,

                    collectionSets: input.collectionSet
                        ? { some: { id: input.collectionSet } }
                        : undefined,
                },
                select: {
                    article: {
                        select: {
                            id: true,
                            title: true,
                            tags: true,
                            brief: true,
                            author: {
                                select: { name: true, profileImg: true },
                            },
                            content: true,
                            viewCount: true,
                            _count: { select: { arguments: true } },
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
        }),
    getSingleCollection: loggedInProcedure
        .input(
            z.object({
                articleId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.prisma.collections.findFirst({
                where: {
                    userId: ctx.user.id,
                    articleId: input.articleId,
                },
                select: {
                    id: true,
                    collectionSets: { select: { id: true } },
                },
            });

            return data
                ? {
                      ...data,
                      collectionSets: data.collectionSets.map((ele) => ele.id),
                  }
                : null;
        }),
    upsertUserCollection: loggedInProcedure
        .input(
            z.object({
                articleId: z.string(),
                collectionSetIds: z.array(z.number()),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const currectCollection = await ctx.prisma.collections.findUnique({
                where: {
                    articleId_userId: {
                        userId: ctx.user.id,
                        articleId: input.articleId,
                    },
                },
                select: {
                    id: true,
                    collectionSets: { select: { id: true } },
                },
            });

            const users = await ctx.prisma.collectionSet.findMany({
                where: { id: { in: input.collectionSetIds } },
                select: { userId: true },
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
                    if (!input.collectionSetIds.includes(ele.id))
                        disconnect.push({ id: ele.id });
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
                    article: { connect: { id: input.articleId } },
                    user: { connect: { id: ctx.user.id } },
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
                            brief: true,
                            author: {
                                select: { name: true, profileImg: true },
                            },
                            content: true,
                            viewCount: true,
                            _count: { select: { arguments: true } },
                        },
                    },
                },
            });
            return processArticles([data.article])[0];
        }),
    deleteUserCollection: loggedInProcedure
        .input(
            z.object({
                collectionId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.collections.deleteMany({
                where: {
                    user: {
                        id: ctx.user.id,
                    },
                    id: input.collectionId,
                },
            });

            return;
        }),
    getCollectionSets: loggedInProcedure.query(async ({ ctx }) => {
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
    }),
    createCollectionSet: loggedInProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
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
        }),

    deleteCollectionSet: loggedInProcedure
        .input(
            z.object({
                colSetId: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.collectionSet.deleteMany({
                where: {
                    id: input.colSetId,
                    user: {
                        id: ctx.user.id,
                    },
                },
            });
            return;
        }),
});
