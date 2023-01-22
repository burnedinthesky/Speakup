import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { ActionIcon, Textarea } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import { cloneDeep } from "lodash";

import {
	articleContentAtom,
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "lib/atoms/advocate/articleEditorAtoms";
import type { ArticleBlockTypes } from "types/article.types";

const BlockTypeStyles = {
	h1: "text-2xl mt-4",
	h2: "text-xl mt-2",
	h3: "text-lg mt-1",
	p: "text-base",
	spoiler: "text-base",
};

const ArticleContent = () => {
	const [articleContent, setArticleContent] =
		useRecoilState(articleContentAtom);

	const [articleEditor, setArticleEditor] = useRecoilState(
		articleEditorInfoAtom,
	);

	const [articleProperties, setArticleProperties] = useRecoilState(
		articlePropertiesAtom,
	);

	const [autoFocus, setAutoFocus] = useState<number | null>(null);

	const autoFocusRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!autoFocusRef.current) return;
			autoFocusRef.current.focus();
			setAutoFocus(null);
		}, 50);
		return () => {
			clearTimeout(timeout);
		};
	}, [autoFocus]);

	return (
		<div className="mt-4 flex w-full flex-col ">
			<h3 className="mb-2 text-2xl font-semibold">議題內文</h3>
			{articleEditor.errors.content && (
				<p className="text-sm text-red-500">{articleEditor.errors.content}</p>
			)}
			{articleContent.map((block, i) => {
				const createNewBlock = () => {
					if (articleContent.some((block) => block.content.length === 0))
						return;
					setArticleContent((cur) => {
						let newContent = cloneDeep(cur);
						newContent.splice(i + 1, 0, {
							type: "p",
							content: "",
						});
						return newContent;
					});
					setAutoFocus(i + 1);
				};

				const deleteBlock = () => {
					setArticleContent((cur) => cur.filter((_, j) => j !== i));
				};
				return (
					<div key={i} className="group flex w-full items-center gap-2">
						<Textarea
							value={block.content}
							ref={
								autoFocus !== null && autoFocus === i ? autoFocusRef : undefined
							}
							onChange={(e) => {
								let updateString = e.currentTarget.value;
								if (updateString[updateString.length - 1] == "\n") {
									createNewBlock();
									return;
								}
								updateString = updateString.replaceAll("\n", "");
								let newBlock = { ...block, content: "" };

								if (updateString === "# ") newBlock.type = "h1";
								else if (updateString === "## ") newBlock.type = "h2";
								else if (updateString === "### ") newBlock.type = "h3";
								else newBlock.content = updateString;
								setArticleContent((cur) =>
									cur.map((block, j) => (j === i ? newBlock : block)),
								);
							}}
							autosize
							className="flex-grow"
							classNames={{
								input: `${
									BlockTypeStyles[block.type] as ArticleBlockTypes
								} w-full`,
							}}
							onFocus={() => {
								setArticleEditor((cur) => ({
									...cur,
									focusedBlock: i,
									overrideBlur: cur.queuedBlur,
								}));
							}}
							onBlur={() => {
								setArticleEditor((cur) => ({
									...cur,
									queuedBlur: true,
								}));
							}}
							onKeyDown={(e) => {
								if (e.key === "Backspace" && block.content.length === 0) {
									if (["h1", "h2", "h3"].includes(block.type))
										setArticleContent((cur) =>
											cur.map((block, j) =>
												j === i ? { ...block, type: "p" } : block,
											),
										);
									else deleteBlock();
								}
							}}
							variant="unstyled"
							placeholder="新增段落"
						/>
						<div className="flex flex-col">
							<ActionIcon
								className="hidden transition-opacity duration-150 group-hover:opacity-100 lg:block lg:opacity-0"
								onClick={() => {
									createNewBlock();
								}}
							>
								<PlusIcon className="w-4 text-slate-500" />
							</ActionIcon>
							<ActionIcon
								className="hidden transition-opacity duration-150 group-hover:opacity-100 lg:block lg:opacity-0"
								onClick={() => {
									deleteBlock();
								}}
							>
								<TrashIcon className="w-4 text-slate-500" />
							</ActionIcon>
						</div>
					</div>
				);
			})}

			<button
				className={`flex h-8 w-full items-center text-slate-500 opacity-40 transition-opacity disabled:invisible hover:opacity-70`}
				disabled={
					articleContent.length >= 1 &&
					articleContent[articleContent.length - 1]?.content.length === 0
				}
				onClick={() => {
					setArticleContent((cur) => [
						...cur,
						{
							type: "p",
							content: "",
						},
					]);
				}}
			>
				<div className="flex-grow border-t border-t-slate-500"></div>
				<div className="mx-4 flex items-center gap-2 ">
					<PlusIcon className="w-4" />
					<p className="text-sm">新增段落</p>
				</div>
				<div className="flex-grow border-t border-t-slate-500"></div>
			</button>
		</div>
	);
};

export default ArticleContent;
