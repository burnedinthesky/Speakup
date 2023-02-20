export type UserReputation = {
	comments: number;
	creator: number;
};

export type User = {
	name: string;
	image: string;
	email: string;
	reputation: UserReputation;
};

export type Author = {
	id: string;
	name: string;
	image?: string;
};
