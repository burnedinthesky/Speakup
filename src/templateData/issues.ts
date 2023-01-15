import { Issue } from "types/issue.types";
import { Article } from "../types/article.types";

export const SampleIssue: Issue = {
	id: "cl90vkxcc0000v5tlvac9c1i2",
	title: "台灣應該廢除早自習嗎？",
	tags: ["教育"],
	content:
		"Ipsum commodo in sit id duis occaecat pariatur proident ullamco enim aliqua. In exercitation ipsum cillum dolore aute irure cillum ut ut officia. Adipisicing nulla aliquip nostrud quis in consequat qui laboris. Incididunt aute commodo sint reprehenderit fugiat. Ullamco occaecat cupidatat labore velit id est aliquip officia exercitation.",
	date: "2020",
	debates: 413,
};

export const SampleArticle: Article = {
	id: "cl90vkxcc0000v5tlvac9c1i2",
	title: "台灣應該廢除早自習嗎？",
	tags: ["教育"],
	brief:
		"Aliquip sit proident nisi labore deserunt labore voluptate commodo eu ad anim voluptate mollit.",
	content: [
		{
			type: "h1",
			content:
				"哇噻這是中文字誒哭哭哇噻這是中文字誒哭哭哇噻這是中文字誒哭哭哇噻這是中文字誒哭哭三二asdfj;klas;djfkl;asjdkl;",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "h2",
			content: "Heading 2",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "h3",
			content: "Heading 3",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "p",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
		{
			type: "spoiler",
			spoilerTitle: "Hello",
			content:
				"Reprehenderit cillum in est in. Cupidatat consequat sint dolore dolor et laboris est qui minim dolore est velit commodo. Non amet eiusmod sit consequat esse voluptate minim commodo eiusmod esse in aute.",
		},
	],
	viewCount: 123989,
	argumentCount: 123892384,
	author: {
		name: "Hello",
		profileImg: "https://hello.com",
	},
	references: [
		{
			title: "Google",
			link: "https://www.google.com",
			description: "We steal your data",
			img: "",
		},
		{
			title: "Google",
			link: "https://www.google.com",
			description: "We steal your data",
			img: "",
		},
		{
			title: "Google",
			link: "https://www.google.com",
			description: "We steal your data",
			img: "",
		},
	],
};
