import z from "zod";

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

export const createUserSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export const createUserOutputSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
