export type CommentAuthor = {
    id: string;
    name: string;
    profileImg: string | null;
    reputation: number;
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
