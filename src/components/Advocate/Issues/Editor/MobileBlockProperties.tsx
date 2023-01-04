import { useRecoilState } from "recoil";

import { ActionIcon, Select } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import { cloneDeep } from "lodash";
import {
	articleContentAtom,
	articleEditorInfoAtom,
} from "../../../../atoms/advocate/articleEditorAtoms";
import { ArticleBlockTypes } from "../../../../types/article.types";

const MobileBlockProperties = () => {
	const [articleContent, setArticleContent] =
		useRecoilState(articleContentAtom);

	const [editorInfo, setEditorInfo] = useRecoilState(articleEditorInfoAtom);

	const createNewBlock = () => {
		if (editorInfo.focusedBlock === null) return;

		if (articleContent.some((block) => block.content.length === 0)) return;
		setArticleContent((cur) => {
			let newContent = cloneDeep(cur);
			newContent.splice((editorInfo.focusedBlock as number) + 1, 0, {
				type: "p",
				content: "",
			});
			return newContent;
		});
	};

	const deleteBlock = () => {
		setArticleContent((cur) =>
			cur.filter((_, j) => j !== editorInfo.focusedBlock),
		);
	};

	return (
		<div
			className={`fixed left-[calc(50vw-160px)] bottom-10 z-10 h-10 w-80 rounded-full border border-slate-300 bg-white px-3 shadow-lg transition-all lg:hidden ${
				editorInfo.focusedBlock === null ? "-bottom-32" : "bottom-10"
			}`}
		>
			{editorInfo.focusedBlock !== null && (
				<div className="flex h-full w-full items-center gap-2">
					<ActionIcon
						onClick={() => {
							createNewBlock();
						}}
					>
						<PlusIcon className="w-4 text-slate-500" />
					</ActionIcon>
					<ActionIcon
						onClick={() => {
							deleteBlock();
						}}
					>
						<TrashIcon className="w-4 text-slate-500" />
					</ActionIcon>
					<Select
						classNames={{
							input: "border-0",
						}}
						data={[
							{ value: "h1", label: "大標" },
							{ value: "h2", label: "中標" },
							{ value: "h3", label: "小標" },
							{ value: "p", label: "段落" },
						]}
						value={articleContent[editorInfo.focusedBlock]?.type}
						onChange={(val: string) => {
							const updateVal = val as ArticleBlockTypes;
							setArticleContent((cur) =>
								cur.map((block, i) =>
									i === editorInfo.focusedBlock
										? {
												...block,
												type: updateVal,
										  }
										: block,
								),
							);
						}}
						onFocus={() => {
							setEditorInfo((cur) => ({
								...cur,
								overrideBlur: cur.queuedBlur,
							}));
						}}
						onBlur={() => {
							setEditorInfo((cur) => ({
								...cur,
								queuedBlur: true,
							}));
						}}
						size="sm"
					/>
				</div>
			)}
		</div>
	);
};
export default MobileBlockProperties;
