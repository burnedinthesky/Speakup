import { PencilIcon } from "@heroicons/react/outline";
import { Badge } from "@mantine/core";
import { TableCell, TableRow } from "@tremor/react";
import Link from "next/link";

interface IssueRowProps {
    issue: {
        id: string;
        title: string;
        tags: string[];
        argumentCount: number;
        status: "passed";
        modPending: number;
    };
}

const StatusBadge = ({ status }: { status: "passed" }) => {
    if (status === "passed") return <Badge color="green">審核通過</Badge>;
    return <Badge />;
};

const IssueRow = ({ issue }: IssueRowProps) => {
    const formatter = Intl.NumberFormat("en", { notation: "compact" });

    return (
        <TableRow>
            <TableCell textAlignment="text-left">{issue.title}</TableCell>
            <TableCell textAlignment="text-center">
                {issue.tags.map((tag, i) => (
                    <Badge key={i}>#{tag}</Badge>
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
                <Link href={`/advocate/issues/${issue.id}`}>
                    <PencilIcon className="w-5" />
                </Link>
            </TableCell>
        </TableRow>
    );
};

export default IssueRow;
