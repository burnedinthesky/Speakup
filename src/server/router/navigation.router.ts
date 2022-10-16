import { z } from "zod";
import { getSingleArticleSchema } from "../../schema/article.schema";
import { HomeRecommendations } from "../../schema/navigation.schema";
import { SampleArticle } from "../../templateData/issues";
import { SampleSearchResults } from "../../templateData/navigation";
import { createRouter } from "../createRouter";

export const navigationRouter = createRouter()
    .query("home", {
        resolve({ ctx }) {
            const data: HomeRecommendations = {
                recommended: {
                    title: "為您推薦",
                    cards: [
                        SampleArticle,
                        SampleArticle,
                        SampleArticle,
                        SampleArticle,
                        SampleArticle,
                    ],
                },
                med: {
                    title: "讚喔",
                    cards: [SampleArticle],
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
            console.log("queried");

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });

            const page = input.onPage ? input.onPage : 1;

            const data = SampleSearchResults;

            return {
                data,
                hasPages: 2,
            };
        },
    });
