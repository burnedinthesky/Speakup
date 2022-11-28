import requestIp from "request-ip";
import z from "zod";
import { publicProcedure, router } from "../trpc";

export const articleRouter = router({
    registerView: publicProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
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
        }),
});
