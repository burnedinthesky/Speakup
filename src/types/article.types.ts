import {
    ArticleTagSlugsToVals,
    ArticleTagValsToSlugs,
} from "../lib/articleTags";

export { ArticleTagSlugsToVals, ArticleTagValsToSlugs };

//prettier-ignore
export const ArticleTagValues = ["娛樂", "環境", "司法", "國家發展", "經濟", "少數族群", "媒體", "醫藥", "道德", "政治", "教育", "家庭", "女性", "自由", "宗教", "科技", "社會政策", "社會運動", "體育",];
//prettier-ignore
export const ArticleTagSlugs = ["ent", "env", "jus", "cnd", "eco", "min", "mda", "med", "eth", "pol", "edu", "fam", "fem", "lib", "rel", "tec", "plc", "scm", "spr"];
//prettier-ignore
export type TypeArticleTagValues = "娛樂" | "環境" | "司法" | "國家發展" | "經濟" | "少數族群" | "媒體" | "醫藥" | "道德" | "政治" | "教育" | "家庭" | "女性" | "自由" | "宗教" | "科技" | "社會政策" | "社會運動" | "體育";
//prettier-ignore
export type TypeArticleTagSlugs = "ent" | "env" | "jus" | "cnd" | "eco" | "min" | "mda" | "med" | "eth" | "pol" | "edu" | "fam" | "fem" | "lib" | "rel" | "tec" | "plc" | "scm" | "spr";

export type ArticleBlockTypes = "h1" | "h2" | "h3" | "p" | "spoiler";

export type ArticleBlock = {
    type: ArticleBlockTypes;
    content: string;
    spoilerTitle?: string;
};

export type ArticleAuthor = {
    name: string;
    profileImg: string | null;
};

export type ReferencesLink = {
    link: string;
    title: string;
    description: string;
    img: string | null;
};

export type Article = {
    id: string;
    title: string;
    brief: string;
    tags: TypeArticleTagValues[];
    author: ArticleAuthor;
    viewCount: number;
    content: ArticleBlock[];
    references: ReferencesLink[];
    argumentCount: number;
};
