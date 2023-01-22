import { useRecoilState } from "recoil";

import { Select } from "@mantine/core";
import {
	articleContentAtom,
	articleEditorInfoAtom,
} from "lib/atoms/advocate/articleEditorAtoms";
import type { ArticleBlockTypes } from "types/article.types";

const DesktopBlockProperties = () => {
	const [articleContent, setArticleContent] =
		useRecoilState(articleContentAtom);
	const [editorInfo, setEditorInfo] = useRecoilState(articleEditorInfoAtom);

	return (
		<div className="mt-28 w-full">
			<Select
				label="段落型態"
				data={[
					{ value: "h1", label: "大標" },
					{ value: "h2", label: "中標" },
					{ value: "h3", label: "小標" },
					{ value: "p", label: "段落" },
				]}
				value={
					editorInfo.focusedBlock !== null
						? articleContent[editorInfo.focusedBlock]?.type
						: undefined
				}
				onChange={(val: string) => {
					const updateVal = val as ArticleBlockTypes;
					setArticleContent((cur) =>
						cur.map((block, i) =>
							i === editorInfo.focusedBlock
								? { ...block, type: updateVal }
								: block,
						),
					);
				}}
				onFocus={() => {
					setEditorInfo((cur) => ({
						...cur,
						focusedBlock: editorInfo.focusedBlock,
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
	);
};

export default DesktopBlockProperties;
