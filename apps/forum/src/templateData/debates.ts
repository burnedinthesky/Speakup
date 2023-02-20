import { UserScfDebate } from "@/types/debate.types";

export const SampleDebate: UserScfDebate = {
	id: "asdf",
	title: "台灣應該要廢除早自習",
	author: {
		id: "uuid",
		name: "Lorum ipsum",
	},
	content:
		"Eiusmod ex et ea sint enim nulla Lorem excepteur aliquip quis exercitation amet do dolore. Ea culpa est ad do mollit ut laboris consequat qui. Do anim eiusmod sit sit pariatur sit eu elit commodo elit. Ipsum aliquip amet adipisicing eu fugiat qui tempor sunt cillum duis voluptate. Nostrud esse exercitation in veniam proident ea aliquip eiusmod esse esse officia ut proident.",
	news: [],
	upvotes: 3,
	userUpvoted: false,
	userDownvoted: false,
};

export const GetRandomDebate = (): UserScfDebate => {
	return {
		id: `${Math.random() * 10000}`,
		title: "台灣應該要廢除早自習",
		author: {
			id: "uuid",
			name: "Lorum ipsum",
		},
		content:
			"Eiusmod ex et ea sint enim nulla Lorem excepteur aliquip quis exercitation amet do dolore. Ea culpa est ad do mollit ut laboris consequat qui. Do anim eiusmod sit sit pariatur sit eu elit commodo elit. Ipsum aliquip amet adipisicing eu fugiat qui tempor sunt cillum duis voluptate. Nostrud esse exercitation in veniam proident ea aliquip eiusmod esse esse officia ut proident.",
		news: [],
		upvotes: 3,
		userUpvoted: false,
		userDownvoted: false,
	};
};
