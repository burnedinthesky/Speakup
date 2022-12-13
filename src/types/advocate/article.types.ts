import { ArticleModStates } from "@prisma/client";
import { Article, ReferencesLink } from "../article.types";

export type ArticleStatus = ArticleModStates;

export interface RawRefLinks {
	status: "queued" | "loading" | "fetched" | "not_found";
	data: ReferencesLink | null;
	url: string;
}

export interface UnpubedArticle
	extends Omit<Article, "argumentCount" | "viewCount"> {
	argumentCount: number | null;
	viewCount: number | null;
}

export interface AvcArticleCard {
	id: string;
	title: string;
	tags: string[];
	viewCount: number | null;
	argumentCount: number | null;
	status: ArticleStatus;
	status_desc: string;
	modPending: number | null;
}

export interface AvcArticle extends UnpubedArticle {
	modStatus: {
		state: ArticleStatus;
		desc: string;
	};
	modPending: number | null;
}
