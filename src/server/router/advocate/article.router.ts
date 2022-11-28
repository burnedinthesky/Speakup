import z from "zod";
import { TRPCError } from "@trpc/server";
import { getLinkPreview } from "link-preview-js";
import { AvcArticleCard } from "../../../types/advocate/article.types";
import { ReferencesLink } from "../../../types/article.types";
import { CheckAvcClearance } from "../../../types/advocate/user.types";
import { ArticleModStatus } from "@prisma/client";
import { avcProcedure, router } from "../../trpc";

export const fetchLinkPreview = async (link: string) => {
    try {
        var previewData = await getLinkPreview(link);
    } catch {
        return {
            title: link,
            description: "",
            img: null,
            link: link,
        };
    }

    let ret: ReferencesLink;

    if ("title" in previewData) {
        ret = {
            title: previewData.title,
            description: previewData.description
                ? previewData.description
                : link,
            img: previewData.images[0] ? previewData.images[0] : null,
            link: link,
        };
    } else {
        ret = {
            title: link,
            description: "",
            img: null,
            link: link,
        };
    }
    return ret;
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
            let references: ReferencesLink[] = [];

            for (let i = 0; i < input.references.length; i++) {
                const link = input.references[i] as string;
                references.push(await fetchLinkPreview(link));
            }

            if (input.id)
                await ctx.prisma.articles.findFirstOrThrow({
                    where: {
                        id: input.id,
                        authorId: ctx.user.id,
                    },
                });

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
                    references: { createMany: { data: references } },
                },
            });

            return {
                id: data.id,
            };
        }),
});
