import { ChatAlt2Icon, ExclamationIcon } from "@heroicons/react/outline";
import { Badge } from "@mantine/core";
import Link from "next/link";
import { forwardRef } from "react";
import { AvcArticleCard } from "../../../../types/advocate/article.types";
import StatusBadge from "./StatusBadge";

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
                            {formatter.format(issue.argumentCount)}
                        </Badge>
                        <StatusBadge status={issue.status} />
                        <Badge
                            leftSection={<ExclamationIcon className="w-3" />}
                        >
                            {formatter.format(issue.modPending)}
                        </Badge>
                    </div>
                </div>
            </Link>
        );
    }
);

ArticleCard.displayName = "ArticleCard";

export default ArticleCard;
