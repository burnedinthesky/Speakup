import { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

import { FlagIcon, ShareIcon } from "@heroicons/react/outline";

import ShareDialog from "./ShareDialog";
import AddToCollection from "../Navigation/Collections/AddToCollection";

import { openDisccusionModal } from "lib/atoms/discussionModal";

interface ArticleInteractionProps {
	articleId: string;
}

const ArticleInteractions = ({ articleId }: ArticleInteractionProps) => {
	const router = useRouter();
	const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);

	const setReportModalData = useSetRecoilState(openDisccusionModal);

	return (
		<div className="flex gap-2">
			<button>
				<AddToCollection
					articleId={articleId}
					classNames={{
						bookmarkIcon: "h-7 text-primary-700",
						collectText: "hidden",
					}}
				/>
			</button>
			<button
				onClick={async () => {
					if (navigator.share) {
						await navigator.share({
							title: "分享這則議題",
							url: `https://speakup.place/${router.pathname}`,
						});
					} else setOpenShareMenu(true);
				}}
			>
				<ShareIcon className="h-7 w-7 text-primary-700" />
			</button>
			<ShareDialog
				opened={openShareMenu}
				closeFn={() => {
					setOpenShareMenu(false);
				}}
				url={`${window.location.href}`}
			/>
			<button
				onClick={() => {
					setReportModalData({
						opened: true,
						type: "article",
						identifier: articleId,
					});
				}}
			>
				<FlagIcon className="h-7 w-7 text-primary-700" />
			</button>
		</div>
	);
};

export default ArticleInteractions;
