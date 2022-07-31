export type CommentAuthor = {
    id: string;
    username: string;
    pfp: string;
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
