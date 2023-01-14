import { forwardRef } from "react";
import Link from "next/link";

import { Badge } from "@mantine/core";
import { ChatAlt2Icon, ExclamationIcon } from "@heroicons/react/outline";
import StatusBadge from "./StatusBadge";

import type { AvcArticleCard } from "types/advocate/article.types";

interface ArticleCardProps {
	issue: AvcArticleCard;
}

const ArticleCard = forwardRef<HTMLDivElement, ArticleCardProps>(
	({ issue }, ref) => {
		const formatter = Intl.NumberFormat("en", { notation: "compact" });

		return (
			<Link href={`/advocate/issues/${issue.id}`}>
				<div
					className="w-full rounded-md border border-slate-200 p-4"
					ref={ref}
				>
					<h3 className="font-semibold">{issue.title}</h3>
					<div className="mt-2 flex flex-wrap gap-2">
						<div className="flex w-full flex-wrap items-center gap-1">
							{issue.tags.map((tag, i) => (
								<Badge key={i}>#{tag}</Badge>
							))}
						</div>
						<Badge leftSection={<ChatAlt2Icon className="w-3" />}>
							{issue.argumentCount
								? formatter.format(issue.argumentCount)
								: "-"}
						</Badge>
						<StatusBadge status={issue.status} />
						<Badge leftSection={<ExclamationIcon className="w-3" />}>
							{issue.modPending ? formatter.format(issue.modPending) : "-"}
						</Badge>
					</div>
				</div>
			</Link>
		);
	},
);

ArticleCard.displayName = "ArticleCard";

export default ArticleCard;
