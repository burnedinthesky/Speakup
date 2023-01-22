import { Author } from "./user.types";

export type NewsLink = {
	link: string;
	title: string;
	description: string;
	img: string | null;
};

export interface Debate {
	id: string;
	title: string;
	author: Author;
	upvotes: number;
	content: string;
	news: NewsLink[];
}

export interface UIDebate extends Debate {
	typing: string[];
}
