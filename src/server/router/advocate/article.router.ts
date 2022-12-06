import { avcProcedure, router } from "../../trpc";

import z from "zod";
import { TRPCError } from "@trpc/server";
import { getLinkPreview } from "link-preview-js";

import type { ArticleModStatus } from "@prisma/client";
import type { AvcArticleCard } from "../../../types/advocate/article.types";
import type { ReferencesLink } from "../../../types/article.types";

type LinkPreviewPromise = Promise<
    | {
          url: string;
          mediaType: string;
          contentType: string;
          favicons: string[];
      }
    | {
          url: string;
          title: string;
          siteName: string | undefined;
          description: string | undefined;
          mediaType: string;
          contentType: string | undefined;
          images: string[];
          favicons: string[];
      }
>;

export const fetchLinksPreview = async (links: string[]) => {
    const fetchTasks = links.map((link) => {
        return {
            task: Promise.race([
                getLinkPreview(link),
                new Promise((resolve) =>
                    setTimeout(() => {
                        resolve({
                            title: link,
                            description: "",
                            images: [],
                            link: link,
                        });
                    }, 2000)
                ),
            ]) as LinkPreviewPromise,
            link: link,
        };
    });

    const results: ReferencesLink[] = await Promise.all(
        fetchTasks.map(async (task) => {
            try {
                var previewData = await task.task;
            } catch (e) {
                return {
                    title: task.link,
                    description: "",
                    img: null,
                    link: task.link,
                };
            }

            let ret: ReferencesLink;

            if ("title" in previewData) {
                ret = {
                    title: previewData.title,
                    description: previewData.description
                        ? previewData.description
                        : task.link,
                    img: previewData.images[0] ? previewData.images[0] : null,
                    link: task.link,
                };
            } else {
                ret = {
                    title: task.link,
                    description: "",
                    img: null,
                    link: task.link,
                };
            }

            return ret;
        })
    );

    return results;
};

export const articleRouter = router({
    allArticles: avcProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.number().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const limit = input.limit ?? 20;
            const cursor = input.cursor ? input.cursor : 0;
            const items = await ctx.prisma.articles.findMany({
                where: {
                    authorId: ctx.user.id,
                },
                select: {
                    id: true,
                    title: true,
                    tags: true,
                    content: true,
                    viewCount: true,
                    status: true,
                    _count: {
                        select: {
                            arguments: true,
                        },
                    },
                },
                take: limit + 1,
                skip: cursor * limit,
                orderBy: {
                    createdTime: "desc",
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (items.length > limit) {
                items.pop();
                nextCursor = cursor + 1;
            }

            const data = items.map((item) => {
                let status = item.status;
                if (!status)
                    status = {
                        articlesId: item.id,
                        status: "pending_mod",
                        desc: "正在等候審核",
                    } as ArticleModStatus;

                return {
                    id: item.id,
                    title: item.title,
                    tags: item.tags,
                    status: status.status,
                    status_desc: status.desc,
                    viewCount: item.viewCount,
                    argumentCount: item._count.arguments,
                    modPending: 0,
                } as AvcArticleCard;
            });
            return {
                data,
                nextCursor,
            };
        }),

    upsertArticle: avcProcedure
        .input(
            z.object({
                id: z.string().or(z.undefined()),
                title: z.string(),
                tags: z.array(z.string()).min(1).max(4),
                brief: z.string().min(30).max(80),
                content: z.array(
                    z.object({
                        type: z.enum(["h1", "h2", "h3", "p", "spoiler"]),
                        content: z.string(),
                    })
                ),
                references: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            let references: ReferencesLink[];
            try {
                references = await fetchLinksPreview(input.references);
            } catch (e) {
                throw new TRPCError({
                    code: "TIMEOUT",
                    message: "Failed to load references",
                });
            }

            let prevRefLinks: string[];

            if (input.id) {
                const currentArticle =
                    await ctx.prisma.articles.findFirstOrThrow({
                        where: {
                            id: input.id,
                            authorId: ctx.user.id,
                        },
                        select: {
                            references: { select: { link: true } },
                        },
                    });

                prevRefLinks = currentArticle.references.map((ref) => ref.link);
            } else {
                const articleWTitle = await ctx.prisma.articles.findFirst({
                    where: {
                        title: input.title,
                    },
                });
                if (articleWTitle)
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Article with title exists",
                    });
            }

            const data = await ctx.prisma.articles.upsert({
                where: {
                    id: input.id,
                    title: input.id ? undefined : input.title,
                },

                create: {
                    title: input.title,
                    author: { connect: { id: ctx.user.id } },
                    tags: input.tags,
                    brief: input.brief,
                    content: input.content,
                    references: { createMany: { data: references } },
                    status: { create: {} },
                },
                update: {
                    title: input.title,
                    author: { connect: { id: ctx.user.id } },
                    tags: input.tags,
                    brief: input.brief,
                    content: input.content,
                    references: {
                        createMany: {
                            skipDuplicates: true,
                            data: references.filter(
                                (cur) => !prevRefLinks.includes(cur.link)
                            ),
                        },
                    },
                },
            });

            return {
                id: data.id,
            };
        }),

    pendingModeration: avcProcedure.query(async ({ ctx }) => {
        const pending_mod = await ctx.prisma.articleModStatus.findMany({
            where: { moderatorId: ctx.user.id },
            select: {
                article: {
                    select: { id: true, title: true },
                },
                registeredModDate: true,
            },
            orderBy: { registeredModDate: "asc" },
        });

        let updateDateQueries: Promise<any>[] = [];

        const ret = pending_mod.map((atc) => {
            let currentTime = new Date();
            if (!atc.registeredModDate) {
                updateDateQueries.push(
                    ctx.prisma.articleModStatus.update({
                        where: { articlesId: atc.article.id },
                        data: { registeredModDate: currentTime },
                    })
                );
            }

            let registeredModDate = atc.registeredModDate
                ? atc.registeredModDate
                : currentTime;

            let remainingDays =
                7 -
                Math.floor(
                    (new Date().getTime() - registeredModDate.getTime()) /
                        1000 /
                        86400
                );

            return {
                id: atc.article.id,
                title: atc.article.title,
                remainingDays: remainingDays,
            };
        });

        await Promise.all(updateDateQueries);

        return ret;
    }),

    moderationPassed: avcProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.articleModStatus.findFirstOrThrow({
                where: { articlesId: input.id, moderatorId: ctx.user.id },
            });

            await ctx.prisma.articleModStatus.update({
                where: { articlesId: input.id },
                data: {
                    desc: "",
                    registeredModDate: null,
                    status: "passed",
                    moderator: { disconnect: true },
                },
            });
        }),

    moderationFailed: avcProcedure
        .input(
            z.object({
                id: z.string(),
                reason: z.string().min(50),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.articleModStatus.findFirstOrThrow({
                where: { articlesId: input.id, moderatorId: ctx.user.id },
            });

            await ctx.prisma.articleModStatus.update({
                where: {
                    articlesId: input.id,
                },
                data: {
                    status: "failed",
                    desc: input.reason,
                    registeredModDate: null,
                    moderator: { disconnect: true },
                },
            });
        }),
});
