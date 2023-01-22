import { useRecoilState, useRecoilValue } from "recoil";

import { ActionIcon, TextInput } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import ReferenceCard from "components/Article/ReferenceCard";

import {
	articleEditorInfoAtom,
	articlePropertiesAtom,
} from "lib/atoms/advocate/articleEditorAtoms";
import type { AppendUrlState } from "./ArticleEditor";

function isValidHttpUrl(url: string) {
	try {
		new URL(url);
	} catch (_) {
		return false;
	}
	return true;
}

interface ArticleReferencesProps {
	addRefLinkInput: AppendUrlState;
	setAddRefLinkInput: (fn: (cur: AppendUrlState) => AppendUrlState) => void;
}

const ArticleReferences = ({
	addRefLinkInput,
	setAddRefLinkInput,
}: ArticleReferencesProps) => {
	const editorInfo = useRecoilValue(articleEditorInfoAtom);
	const [atcProperties, setAtcProperties] = useRecoilState(
		articlePropertiesAtom,
	);

	return (
		<div className="w-full">
			<h3 className="text-2xl font-semibold">參考資料</h3>
			{editorInfo.errors.refLinks && (
				<p className="text-red-500">{editorInfo.errors.refLinks}</p>
			)}
			<div className="mt-4 flex w-full flex-col gap-4">
				{atcProperties.refLinks.map((link, i) => {
					return (
						<div key={i} className="flex w-full items-center gap-2">
							{link.data ? (
								<ReferenceCard data={link.data} />
							) : link.status === "not_found" ? (
								<p className="text-red-500">預覽失敗（404） {link.url}</p>
							) : (
								<p className="text-slate-500">{link.url}</p>
							)}
							<ActionIcon
								onClick={() => {
									setAtcProperties((cur) => ({
										...cur,
										refLinks: cur.refLinks.filter(
											(mapLink) => mapLink.url !== link.url,
										),
									}));
								}}
							>
								<TrashIcon className="w-4" />
							</ActionIcon>
						</div>
					);
				})}
			</div>
			<div className="mt-2 flex w-full items-center gap-2">
				<TextInput
					className="flex-grow "
					classNames={{
						input: "text-slate-500",
					}}
					variant="unstyled"
					placeholder="新增連結"
					value={addRefLinkInput.text}
					onChange={(e) => {
						const url = e.currentTarget.value;
						setAddRefLinkInput((cur) => ({
							...cur,
							text: url,
							error: null,
						}));
					}}
					error={addRefLinkInput.error}
				/>
				<ActionIcon
					onClick={() => {
						if (!isValidHttpUrl(addRefLinkInput.text))
							setAddRefLinkInput((cur) => ({
								...cur,
								error: "請輸入格式正確的URL",
							}));
						else if (
							atcProperties.refLinks.some(
								(link) => link.url === addRefLinkInput.text,
							)
						)
							setAddRefLinkInput((cur) => ({
								...cur,
								error: "已將本網址加入參考資料",
							}));
						else {
							setAtcProperties((cur) => ({
								...cur,
								refLinks: cur.refLinks.concat([
									{
										data: null,
										status: "queued",
										url: addRefLinkInput.text,
									},
								]),
							}));
							setAddRefLinkInput((cur) => ({
								text: "",
								error: null,
							}));
						}
					}}
				>
					<PlusIcon className="w-4" />
				</ActionIcon>
			</div>
		</div>
	);
};

export default ArticleReferences;
