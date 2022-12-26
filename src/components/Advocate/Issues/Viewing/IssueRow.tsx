import { forwardRef } from "react";

import Link from "next/link";
import { TableCell, TableRow } from "@tremor/react";
import { Badge } from "@mantine/core";
import { PencilIcon } from "@heroicons/react/outline";

import { AvcArticleCard } from "../../../../types/advocate/article.types";
import StatusBadge from "./StatusBadge";

interface IssueRowProps {
    issue: AvcArticleCard;
}

const IssueRow = forwardRef<HTMLDivElement, IssueRowProps>(({ issue }, ref) => {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return (
        <TableRow>
            <TableCell textAlignment="text-left">
                <Link href={`/advocate/issues/${issue.id}`}>
                    <p>{issue.title}</p>
                </Link>
            </TableCell>
            <TableCell textAlignment="text-center">
                {issue.tags.map((tag, i) => (
                    <Badge className="mx-1" key={i}>
                        #{tag}
                    </Badge>
                ))}
            </TableCell>
            <TableCell textAlignment="text-center">
                {issue.argumentCount ? formatter.format(issue.argumentCount) : "-"}
            </TableCell>
            <TableCell textAlignment="text-center">
                <StatusBadge status={issue.status} />
            </TableCell>
            <TableCell textAlignment="text-center">
                {issue.modPending ? formatter.format(issue.modPending) : "-"}
            </TableCell>
            <TableCell textAlignment="text-center">
                <div className="hidden" ref={ref}></div>
                <Link href={`/advocate/issues/${issue.id}`}>
                    <PencilIcon className="w-5" />
                </Link>
            </TableCell>
        </TableRow>
    );
});

IssueRow.displayName = "IssueRow";

export default IssueRow;
