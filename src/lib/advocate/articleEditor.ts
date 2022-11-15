import { RawRefLinks } from "../../types/advocate/article.types";
import { ReferencesLink } from "../../types/article.types";

interface Data {
    title: string;
    brief: string;
    tags: string[];
    content: string[];
    refLinks: RawRefLinks[];
}

interface ReturnErrors {
    title: string | null;
    brief: string | null;
    tags: string | null;
    content: string | null;
    refLinks: string | null;
}

export const checkArticleData = (data: Data) => {
    let errors: ReturnErrors = {
        title: null,
        brief: null,
        tags: null,
        content: null,
        refLinks: null,
    };

    let passed = 0;

    if (data.title.length == 0) errors.title = "請輸入標題";
    else if (data.title.length > 32)
        errors.title = "標題過長，請縮短至三十二個字";
    else passed++;

    if (data.content.some((block) => block.length <= 0))
        errors.content = "請確認每格議題均有文字";
    else if (data.content.length < 4) errors.content = "議題過短";
    else passed++;

    if (data.tags.length < 1) {
        errors.tags = "請選擇至少一個標籤";
    } else passed++;

    if (data.brief.length < 10) {
        errors.brief = "簡介過短，請輸入至少十個字";
    } else if (data.brief.length > 60) {
        errors.brief = "簡介過長，請輸入至多六十個字";
    } else passed++;

    if (data.refLinks.length < 2) {
        errors.refLinks = "請參考至少兩篇資料";
    } else passed++;

    if (passed < 5) return errors;
    return null;
};
