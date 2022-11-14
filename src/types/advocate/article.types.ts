export interface AvcArticleCard {
    id: string;
    title: string;
    tags: string[];
    viewCount: number;
    argumentCount: number;
    status: "pending_mod" | "passed";
    status_desc: string;
    modPending: number;
}
