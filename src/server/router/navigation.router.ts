import { getSingleArticleSchema } from "../../schema/article.schema";
import { HomeRecommendations } from "../../schema/navigation.schema";
import { SampleArticle } from "../../templateData/issues";
import { createRouter } from "../createRouter";

export const navigationRouter = createRouter().query("home", {
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
});
