import { forwardRef } from "react";

import Link from "next/link";
import { TableCell, TableRow } from "@tremor/react";
import { Badge } from "@mantine/core";
import { CheckIcon, ClockIcon, PencilIcon } from "@heroicons/react/outline";

import { AvcArticleCard } from "../../../../types/advocate/article.types";

interface IssueRowProps {
    issue: AvcArticleCard;
}

const StatusBadge = ({ status }: { status: "pending_mod" | "passed" }) => {
    if (status === "pending_mod")
        return (
            <Badge leftSection={<ClockIcon className="w-4" />} color="yellow">
                審核中
            </Badge>
        );
    if (status === "passed")
        return (
            <Badge leftSection={<CheckIcon className="w-4" />} color="green">
                審核通過
            </Badge>
        );
    return <Badge />;
};

const IssueRow = forwardRef<HTMLSpanElement, IssueRowProps>(
    ({ issue }, ref) => {
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
                    {formatter.format(issue.argumentCount)}
                </TableCell>
                <TableCell textAlignment="text-center">
                    <StatusBadge status={issue.status} />
                </TableCell>
                <TableCell textAlignment="text-center">
                    {formatter.format(issue.modPending)}
                </TableCell>
                <TableCell textAlignment="text-center">
                    <span className="hidden" ref={ref}></span>
                    <Link href={`/advocate/issues/${issue.id}`}>
                        <PencilIcon className="w-5" />
                    </Link>
                </TableCell>
            </TableRow>
        );
    }
);

IssueRow.displayName = "IssueRow";

export default IssueRow;
