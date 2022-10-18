import z from "zod";

export type CommentAuthor = {
    id: string;
    username: string;
    profileImg: string;
};

export type Stances = "sup" | "agn" | "neu";

export type ArgumentThread = {
    id: number;
    name: string;
    argumentId: number;
};

export type Argument = {
    id: number;
    content: string;
    author: CommentAuthor;
    isAuthor: boolean;
    stance: Stances;
    likes: number;
    userLiked: boolean;
    support: number;
    userSupported: boolean;
    dislikes: number;
    userDisliked: boolean;
    hasComments: boolean;
    threads: ArgumentThread[];
};

export type Comment = {
    id: number;
    author: CommentAuthor;
    isAuthor: boolean;
    content: string;
    stance: Stances;
    thread?: ArgumentThread;
    likes: number;
    userLiked: boolean;
    support: number;
    userSupported: boolean;
    dislikes: number;
    userDisliked: boolean;
};

export const fetchCommentsSchema = z.object({
    threadId: z.number(),
    stance: z.enum(["sup", "agn", "both"]),
    sort: z.string(),
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
});

export const createThreadSchema = z.object({
    content: z.string(),
    threadGroupId: z.number(),
    stance: z.string().length(3),
});

export const fetchThreadCommentsSchema = z.object({
    threadId: z.number(),
    limit: z.number(),
    cursor: z.number().nullish(),
});
