import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import useSubmitArticle from "hooks/advocate/useSubmitArticle";

import { Button, Textarea } from "@mantine/core";

import ArticleContent from "./ArticleContent";
import ArticleReferences from "./ArticleReferences";
import MobileBlockProperties from "./MobileBlockProperties";
import ArticleStatusBanner from "./ArticleStatusBanner";

import { showNotification } from "@mantine/notifications";

import {
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "atoms/advocate/articleEditorAtoms";
import type { ArticleStatus, RawRefLinks } from "types/advocate/article.types";

export interface ContentErrors {
	title: string | null;
	content: string | null;
	refLinks: string | null;
}

export interface AppendUrlState {
	text: string;
	error: string | null;
}

interface ArticleEditorProps {
	articleId: string | null;
	initialTitle?: string;
	initialContent?: string[];
	initialRefLinks?: RawRefLinks[];
	modStatus?: {
		state: ArticleStatus;
		desc?: string;
	};
	setOpenAtcPropDrawer: (val: boolean) => void;
}

const ArticleEditor = ({
	articleId,
	modStatus,
	setOpenAtcPropDrawer,
}: ArticleEditorProps) => {
	const [editorInfo, setEditorInfo] = useRecoilState(articleEditorInfoAtom);
	const [articleProperties, setArticleProperties] = useRecoilState(
		articlePropertiesAtom,
	);

	const [addRefLinkInput, setAddRefLinkInput] = useState<AppendUrlState>({
		text: "",
		error: null,
	});

	const { submitData, isLoading } = useSubmitArticle({ articleId });

	const updateReferenceLinks = () => {
		articleProperties.refLinks.forEach((link) => {
			if (link.status !== "queued") return;
			setArticleProperties((cur) => ({
				...cur,
				refLinks: cur.refLinks.map((curLink) =>
					curLink.url === link.url
						? {
								...curLink,
								status: "loading",
						  }
						: curLink,
				),
			}));
			fetch("/api/utils/previewlink/", {
				method: "POST",
				body: JSON.stringify({
					link: link.url,
				}),
			})
				.then(async (res) => {
					if (!res.ok)
						throw new Error(res.status === 404 ? "not_found" : "unknown");
					const data = await res.json();
					setArticleProperties((cur) => ({
						...cur,
						refLinks: cur.refLinks.map((ftrLink) =>
							ftrLink.url === link.url
								? {
										...ftrLink,
										status: "fetched",
										url: ftrLink.url,
								  }
								: ftrLink,
						),
					}));
				})
				.catch((err) => {
					if (err.message === "not_found")
						setArticleProperties((cur) => ({
							...cur,
							refLinks: cur.refLinks.map((ftrLink) =>
								ftrLink.url === link.url
									? {
											data: null,
											status: "not_found",
											url: ftrLink.url,
									  }
									: ftrLink,
							),
						}));
					else
						showNotification({
							color: "red",
							title: "發生錯誤",
							message: "於預覽連結時發生錯誤，請檢查連結是否正確",
						});
				});
		});
	};

	useEffect(() => {
		updateReferenceLinks();
	}, [articleProperties.refLinks]);

	return (
		<div className=" w-full pb-20">
			<Textarea
				classNames={{
					input: "text-3xl font-bold",
				}}
				placeholder="議題標題"
				variant="unstyled"
				size="xl"
				value={articleProperties.title}
				onChange={(e) => {
					const newTitle = e.currentTarget.value;
					if (newTitle[newTitle.length - 1] === "\n") return;
					setArticleProperties((cur) => ({
						...cur,
						title: newTitle,
					}));
					setEditorInfo((cur) => ({
						...cur,
						errors: {
							...cur.errors,
							title: null,
						},
					}));
				}}
				error={editorInfo.errors.title}
				autosize
			/>
			{modStatus && (
				<ArticleStatusBanner state={modStatus.state} desc={modStatus.desc} />
			)}

			<ArticleContent />
			<div className="my-4 w-full border-b border-b-slate-400" />

			<ArticleReferences
				addRefLinkInput={addRefLinkInput}
				setAddRefLinkInput={setAddRefLinkInput}
			/>

			<div className="mt-6 flex gap-4">
				<Button
					className="lg:hidden"
					variant="outline"
					onClick={() => {
						setOpenAtcPropDrawer(true);
					}}
					color={
						editorInfo.errors.brief || editorInfo.errors.tags
							? "red"
							: "primary"
					}
				>
					議題設定
				</Button>
				<Button
					variant="outline"
					onClick={() => {
						submitData();
					}}
				>
					發布
				</Button>
			</div>
			<MobileBlockProperties />
		</div>
	);
};

export default ArticleEditor;
