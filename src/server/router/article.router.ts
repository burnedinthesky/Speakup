import { createRouter } from "../createRouter";
import requestIp from "request-ip";
import z from "zod";

export const articleRouter = createRouter().mutation("register-view", {
    input: z.string(),
    async resolve({ ctx, input }) {
        let ret = false;
        if (ctx.user) {
            const data = await ctx.prisma.articleViews.findMany({
                where: {
                    userId: ctx.user.id,
                },
            });
            ret = data.length > 0;
        } else {
            const clientIp = requestIp.getClientIp(ctx.req);

            const data = await ctx.prisma.articleViews.findMany({
                where: {
                    ip: clientIp,
                },
            });
            ret = data.length > 0;
        }
        if (ret) return true;

        const views = await ctx.prisma.articles.findUniqueOrThrow({
            where: {
                id: input,
            },
            select: {
                viewCount: true,
            },
        });
        await ctx.prisma.articles.update({
            where: {
                id: input,
            },
            data: {
                viewCount: views.viewCount + 1,
            },
        });

        return true;
    },
});
