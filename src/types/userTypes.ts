export type UserReputation = {
    comments: number;
    creator: number;
};

export type User = {
    username: string;
    image: string;
    email: string;
    reputation: UserReputation;
};
