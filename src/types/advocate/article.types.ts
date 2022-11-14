import { Article } from "../article.types";

export interface AvcArticle extends Article {
    status: "passed";
    modPending: number;
}
