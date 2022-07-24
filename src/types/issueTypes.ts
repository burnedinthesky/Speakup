export type ArticleBlock = {
    type: "h1" | "h2" | "h3" | "p" | "spoiler";
    content: string;
    spoilerTitle?: string;
};

export type ArticleAuthor = {
    username: string;
    pfp: string;
};

export type FurtherReadingLink = {
    title: string;
    link: string;
};

export type Article = {
    id: string;
    title: string;
    tags: string[];
    content: ArticleBlock[];
    furtherReading: FurtherReadingLink[];
    author: ArticleAuthor;
    views: number;
};
