import z from "zod";

//prettier-ignore
export const ArticleTagValues = ["娛樂", "環境", "司法", "國家發展", "經濟", "少數族群", "媒體", "醫藥", "道德", "政治", "教育", "家庭", "女性", "自由", "宗教", "科技", "社會政策", "社會運動", "體育",];
//prettier-ignore
export const ArticleTagSlugs = ["ent", "env", "jus", "cnd", "eco", "min", "mda", "med", "eth", "pol", "edu", "fam", "fem", "lib", "rel", "tec", "plc", "scm", "spr"];

export const ArticleTagSlugsToVals = {
    ent: "娛樂",
    env: "環境",
    jus: "司法",
    cnd: "國家發展",
    eco: "經濟",
    min: "少數族群",
    mda: "媒體",
    med: "醫藥",
    eth: "道德",
    pol: "政治",
    edu: "教育",
    fam: "家庭",
    fem: "女性",
    lib: "自由",
    rel: "宗教",
    tec: "科技",
    plc: "社會政策",
    scm: "社會運動",
    spr: "體育",
} as { [key: string]: string };

export type ArticleTags =
    | "娛樂"
    | "環境"
    | "司法"
    | "國家發展"
    | "經濟"
    | "少數族群"
    | "媒體"
    | "醫藥"
    | "道德"
    | "政治"
    | "教育"
    | "家庭"
    | "女性"
    | "自由"
    | "宗教"
    | "科技"
    | "社會政策"
    | "社會運動"
    | "體育";
export type ArticleTagSlugs = typeof ArticleTagSlugs[number];

export type ArticleBlock = {
    type: "h1" | "h2" | "h3" | "p" | "spoiler";
    content: string;
    spoilerTitle?: string;
};

export type ArticleAuthor = {
    name: string;
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
    author: ArticleAuthor;
    viewCount: number;
    content: ArticleBlock[];
    references: ReferencesLink[];
    argumentCount: number;
};
