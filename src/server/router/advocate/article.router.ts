import { createRouter } from "../../createRouter";
import z from "zod";
import { AvcArticleCard } from "../../../types/advocate/article.types";

export const articleRouter = createRouter().query("all-articles", {
    input: z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
    }),
    async resolve({ input, ctx }) {
        const limit = input.limit ?? 20;
        const cursor = input.cursor ? input.cursor : 0;
        const items = await ctx.prisma.articles.findMany({
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
            const status = item.status as {
                status: "pending_mod" | "passed";
                desc: string;
            };
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
    },
});
