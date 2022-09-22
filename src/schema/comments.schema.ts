import z from "zod";

export type CommentAuthor = {
    id: string;
    username: string;
    profileImg: string;
};

export type Stances = "sup" | "agn" | "neu";

export type Comment = {
    id: number;
    author: CommentAuthor;
    isOwner: boolean;
    message: string;
    stance: Stances;
    leadsThread: number | undefined;
    threadReplies: number | undefined;
    likes: number;
    userLiked: boolean;
    support: number;
    userSupported: boolean;
    dislikes: number;
    userDisliked: boolean;
};

export type ThreadData = {
    id: number;
    leadComment: Comment;
};

export const fetchTGFirstComment = z.object({
    TGID: z.number(),
    stance: z.enum(["sup", "agn", "both"]),
    sort: z.string(),
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
});

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

export const createCommentSchema = z.object({
    content: z.string(),
    threadId: z.number(),
    stance: z.string().length(3),
});

export const fetchThreadCommentsSchema = z.object({
    threadId: z.number(),
    limit: z.number(),
    cursor: z.number().nullish(),
});

export const deleteCommentSchema = z.object({
    id: z.number(),
});
