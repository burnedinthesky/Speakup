import { forwardRef } from "react";

import Link from "next/link";
import {
	ActionIcon,
	Badge,
	Button,
	LoadingOverlay,
	Popover,
} from "@mantine/core";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import StatusBadge from "./StatusBadge";

import { trpc } from "utils/trpc";
import { showErrorNotification } from "lib/errorHandling";
import type { AvcArticleCard } from "types/advocate/article.types";

interface IssueRowProps {
	issue: AvcArticleCard;
}

const IssueRow = forwardRef<HTMLDivElement, IssueRowProps>(({ issue }, ref) => {
	const formatter = Intl.NumberFormat("en", { notation: "compact" });

	const trpcUtils = trpc.useContext();

	const deleteAtcMutation = trpc.advocate.articles.deleteArticle.useMutation({
		onSuccess() {
			trpcUtils.advocate.articles.allArticles.setInfiniteData({}, (data) => {
				if (!data)
					return {
						pages: [],
						pageParams: [],
					};

				return {
					...data,
					pages: data.pages.map((page) => ({
						...page,
						data: page.data.filter((article) => article.id !== issue.id),
					})),
				};
			});
			trpcUtils.advocate.articles.allArticles.invalidate();
		},
		onError() {
			showErrorNotification({ message: "請再試一次" });
		},
	});

	return (
		<tr className="text-center py-2 mx-12 border-y text-sm text-neutral-800 group relative">
			<LoadingOverlay visible={deleteAtcMutation.isLoading} />
			<td className="py-5 pl-6">
				<Link href={`/advocate/issues/${issue.id}`}>
					<p className="text-left">{issue.title}</p>
				</Link>
			</td>
			<td>
				{issue.tags.map((tag, i) => (
					<Badge className="mx-1" key={i}>
						#{tag}
					</Badge>
				))}
			</td>
			<td>
				{issue.argumentCount ? formatter.format(issue.argumentCount) : "-"}
			</td>
			<td>
				<StatusBadge status={issue.status} />
			</td>
			<td>{issue.modPending ? formatter.format(issue.modPending) : "-"}</td>
			<td className="pr-6">
				<div className="hidden" ref={ref}></div>
				<div className="flex gap-2">
					<ActionIcon>
						<Link href={`/advocate/issues/${issue.id}`}>
							<PencilIcon className="w-5" />
						</Link>
					</ActionIcon>
					<Popover>
						<Popover.Target>
							<ActionIcon>
								<TrashIcon className="w-5 group-hover:opacity-80 opacity-0 transition-opacity duration-300 delay-100 text-red-500" />
							</ActionIcon>
						</Popover.Target>
						<Popover.Dropdown>
							<p className="inline-block mr-2">您確定要刪除本議題嗎？</p>
							<Button
								className="inline"
								size="xs"
								color="red"
								variant="outline"
								onClick={() => {
									deleteAtcMutation.mutate({ id: issue.id });
								}}
							>
								是
							</Button>
						</Popover.Dropdown>
					</Popover>
				</div>
			</td>
		</tr>
	);
});

IssueRow.displayName = "IssueRow";

export default IssueRow;
