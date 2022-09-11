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
    replies: number;
    likes: number;
    userLiked: boolean;
    support: number;
    userSupported: boolean;
    dislikes: number;
    userDisliked: boolean;
};

export const fetchTGFirstComment = z.object({
    TGID: z.number(),
    stance: z.enum(["sup", "agn", "both"]),
    sort: z.string(),
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
})

export const fetchCommentsSchema = z.object({
    threadId: z.number(),
    stance: z.enum(["sup", "agn", "both"]),
    sort: z.string(),
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
});

export type fetchCommentsInput = z.TypeOf<typeof fetchCommentsSchema>;

export const createCommentsSchema = z.object({
    content: z.string(),
    articleId: z.string(),
    onside: z.string().max(3),
});

export type createCommentsInput = z.TypeOf<typeof createCommentsSchema>;

export const getComments = z.object({
    articleId: z.string().uuid(),
    onside: z.string(),
});

export const createCommentsActionSchema = z.object({
    commentId: z.number(),
    action: z.string(),
});

export type putCommentAction = z.TypeOf<typeof createCommentsActionSchema>;
