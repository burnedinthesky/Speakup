import { atom } from "recoil";
import { RawRefLinks } from "../../types/advocate/article.types";
import type {
	ArticleBlock,
	TypeArticleTagValues,
} from "../../types/article.types";

interface Editor {
	isSubmitting: boolean;
	focusedBlock: number | null;
	queuedBlur: boolean;
	overrideBlur: boolean;
	errors: {
		title: string | null;
		tags: string | null;
		brief: string | null;
		content: string | null;
		refLinks: string | null;
	};
}

interface Properties {
	title: string;
	tags: TypeArticleTagValues[];
	brief: string;
	refLinks: RawRefLinks[];
}

export const articleContentAtom = atom({
	key: "articleContent",
	default: [] as ArticleBlock[],
});

export const articleEditorInfoAtom = atom({
	key: "articleEditor",
	default: {
		isSubmitting: false,
		focusedBlock: null,
		queuedBlur: false,
		overrideBlur: true,
		errors: {
			tags: null,
			brief: null,
			content: null,
		},
	} as Editor,
});

export const articlePropertiesAtom = atom({
	key: "articleProperties",
	default: {
		title: "",
		tags: [],
		brief: "",
		refLinks: [],
	} as Properties,
});
