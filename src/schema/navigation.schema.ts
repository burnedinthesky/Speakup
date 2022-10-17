import { ArticleAuthor } from "./article.schema";

export type NavCardData = {
    id: string;
    title: string;
    tags: string[];
    author: ArticleAuthor;
    viewCount: number;
    brief: string;
    argumentCount: number;
};

export type HomeRecommendation = {
    title: string;
    cards: NavCardData[];
};

export type HomeRecommendations = {
    [key: string]: HomeRecommendation;
};
