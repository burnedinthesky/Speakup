import { atom } from "recoil";
import type { TypeArticleTagValues } from "../../types/article.types";

interface data {
    tags: TypeArticleTagValues[];
    brief: string;
    errors: {
        tags: string | null;
        brief: string | null;
    };
}

export const articlePropertiesAtom = atom({
    key: "articleProperties",
    default: {
        tags: [],
        brief: "",
        errors: {
            tags: null,
            brief: null,
        },
    } as data,
});
