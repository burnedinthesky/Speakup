import { Article } from "./article.schema";

export type HomeRecommendation = {
    title: string;
    cards: Article[];
};

export type HomeRecommendations = {
    [key: string]: HomeRecommendation;
};
