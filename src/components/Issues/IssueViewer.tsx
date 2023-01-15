import {
	BookmarkIcon,
	CalendarIcon,
	ChatAlt2Icon,
	FlagIcon,
	ShareIcon,
} from "@heroicons/react/outline";
import { ActionIcon } from "@mantine/core";
import { Issue } from "types/issue.types";

interface IssueViewerProps {
	issue: Issue;
}

const IssueViewer = ({ issue }: IssueViewerProps) => {
	return (
		<div className="w-full p-4 bg-white rounded-md">
			<h1 className="text-xl font-semibold text-gray-900 lg:text-2xl">
				{issue.title}
			</h1>
			<div className="flex mt-2 gap-3 text-primary-600">
				{issue.tags.map((tag) => (
					<div
						className="px-3 py-0.5 lg:py-1 rounded-full border border-primary-600 "
						key={tag}
					>
						<p className="text-[11px] lg:text-xs">#{tag}</p>
					</div>
				))}
			</div>
			<div className="flex mt-1 lg:mt-2 gap-3 text-primary-600">
				<div>
					<CalendarIcon className="w-5 lg:w-6 inline" />
					<p className="ml-1.5 inline text-xs lg:text-sm">{issue.date}</p>
				</div>
				<div>
					<ChatAlt2Icon className="w-5 lg:w-6 inline" />
					<p className="ml-1.5 inline text-xs lg:text-sm">{issue.debates}</p>
				</div>
			</div>
			<div className="mt-4 text-gray-800">
				<h3 className="font-semibold lg:text-lg">事件簡述</h3>
				<p className="mt-1 text-sm lg:text-base whitespace-pre-wrap">
					{issue.content}
				</p>
			</div>
			<div className="mt-3 flex gap-1 -translate-x-0.5">
				<ActionIcon size="md">
					<BookmarkIcon className="w-6 lg:w-7 text-primary-600" />
				</ActionIcon>
				<ActionIcon size="md">
					<FlagIcon className="w-6 lg:w-7 text-primary-600" />
				</ActionIcon>
				<ActionIcon size="md">
					<ShareIcon className="w-6 lg:w-7 text-primary-600" />
				</ActionIcon>
			</div>
		</div>
	);
};

export default IssueViewer;
