import { ArticleAuthor } from "./article.types";

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

export type CollectionSet = {
    id: number;
    name: string;
};
