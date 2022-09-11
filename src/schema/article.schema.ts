import z from "zod";

//prettier-ignore
export const ArticleTagValues = ["娛樂", "環境", "司法", "國家發展", "經濟", "少數族群", "媒體", "醫藥", "道德", "政治", "教育", "家庭", "女性", "自由", "宗教", "科技", "社會政策", "社會運動", "體育",];
//prettier-ignore
export const ArticleTagSlugs = ["ent", "env", "jus", "cnd", "eco", "min", "mda", "med", "eth", "pol", "edu", "fam", "fem", "lib", "rel", "tec", "plc", "scm", "spr"];

export type ArticleTags = typeof ArticleTagValues[number];
export type ArticleTagSlugs = typeof ArticleTagSlugs[number];

export type ArticleBlock = {
    type: "h1" | "h2" | "h3" | "p" | "spoiler";
    content: string;
    spoilerTitle?: string;
};

export type ArticleAuthor = {
    username: string;
    profileImg: string;
};

export type ReferencesLink = {
    title: string;
    link: string;
};

export type Article = {
    id: string;
    title: string;
    tags: ArticleTags[];
    content: ArticleBlock[];
    references: ReferencesLink[];
    author: ArticleAuthor;
    threadGroupId: number;
    viewCount: number;
    commentCount: number;
};

export const createArticleSchema = z.object({
    h1: z.string(),
    h2: z.string(),
    h3: z.string(),
    spoiler: z.string(),
    content: z.string(),
    tags: z.string(),
});

export type createArticleInput = z.TypeOf<typeof createArticleSchema>;

export const getSingleArticleSchema = z.object({
    articleId: z.string().uuid(),
});
