import { Article } from "./issueTypes";

export type HomeRecommendation = {
    title: string;
    cards: Article[];
};

export type HomeRecommendations = {
    [key: string]: HomeRecommendation;
};
