export type UserReputation = {
	comments: number;
	creator: number;
};

export type User = {
	name: string;
	image: string;
	email: string;
	reputation: UserReputation;
};

export type Author = {
	id: string;
	name: string;
	image: string;
};

export type FeedArgument = {
	id: number;
	content: string;
	articleTitle: string;
	time: Date;
	feedType: "argument";
};

export type FeedComment = {
	id: number;
	content: string;
	argumentId: number;
	argumentContent: string;
	articleTitle: string;
	time: Date;
	feedType: "comment";
};

export type FeedArticle = {
	id: string;
	title: string;
	brief: string;
	time: Date;
	feedType: "article";
};
