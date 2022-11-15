import { Article, ReferencesLink } from "../article.types";

export type ArticleStatus = "pending_mod" | "passed";

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
    status: ArticleStatus;
    status_desc: string;
    modPending: number;
}
