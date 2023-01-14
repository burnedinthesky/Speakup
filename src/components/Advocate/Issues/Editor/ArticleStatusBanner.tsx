import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import { ArticleStatus } from "types/advocate/article.types";

interface ArticleStatusBannerProps {
	state: ArticleStatus;
	desc?: string;
}

const ArticleStatusBanner = ({ state, desc }: ArticleStatusBannerProps) => {
	if (state === "passed") return <></>;

	if (state === "pending_mod" || state === "report_pending_mod")
		return (
			<div className="my-4 flex gap-4 rounded-md bg-yellow-100 px-5 py-3 text-yellow-600">
				<ExclamationIcon className="w-5" />
				<p>{desc}</p>
			</div>
		);

	if (state === "failed")
		return (
			<div className="my-4 flex gap-4 rounded-md bg-red-100 px-5 py-3 text-red-500">
				<XIcon className="w-7 flex-shrink-0" />
				<div className="flex-grow">
					<h3 className="font-bold">議題未過審</h3>
					<p className="whitespace-pre-line text-sm">{desc}</p>
				</div>
			</div>
		);

	return <></>;
};

export default ArticleStatusBanner;
