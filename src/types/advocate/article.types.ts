import { ArticleModStates } from "@prisma/client";
import { Article, ReferencesLink } from "../article.types";

export type ArticleStatus = ArticleModStates;

export interface RawRefLinks {
    status: "queued" | "loading" | "fetched" | "not_found";
    data: ReferencesLink | null;
    url: string;
}

export interface AvcArticleCard {
    id: string;
    title: string;
    tags: string[];
    viewCount: number;
    argumentCount: number;
    status: ArticleStatus;
    status_desc: string;
    modPending: number;
}

export interface AvcArticle extends Article {
    modStatus: {
        state: ArticleStatus;
        desc: string;
    };
    modPending: number;
}
