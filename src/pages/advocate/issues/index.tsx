import { AppShell } from "../../../components/Advocate/AppShell";
import { trpc } from "../../../utils/trpc";
import { useInView } from "react-intersection-observer";

import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
} from "@tremor/react";
import { Button } from "@mantine/core";
import { PlusIcon } from "@heroicons/react/outline";

import IssueRow from "../../../components/Advocate/Issues/Table/IssueRow";
import IssueRowLoading from "../../../components/Advocate/Issues/Table/IssueRowLoading";
import { useEffect } from "react";

const Issues = () => {
    const { data, isLoading, hasNextPage, fetchNextPage } =
        trpc.useInfiniteQuery([
            "advocate.articles.all-articles",
            { limit: 20 },
        ]);

    const issues = data?.pages.flatMap((page) => page.data);

    const {
        ref: lastRowRef,
        entry,
        inView: lastRowInView,
    } = useInView({
        threshold: 0.8,
    });

    useEffect(() => {
        if (entry !== undefined) {
            if (entry.isIntersecting && hasNextPage && !isLoading) {
                fetchNextPage();
            }
        }
    }, [lastRowInView]);

    return (
        <AppShell title="Speakup - 議題管理" highlight="issues">
            <div className="ml-64 px-12 pt-10">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-3xl font-bold">您的議題</h1>
                    <Button
                        className="bg-primary-600"
                        leftIcon={<PlusIcon className="h-4" />}
                    >
                        新增議題
                    </Button>
                </div>
                <div className="mt-9 rounded-md border border-slate-300">
                    <Table marginTop="mt-0">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell textAlignment="text-left">
                                    標題
                                </TableHeaderCell>
                                <TableHeaderCell textAlignment="text-center">
                                    標籤
                                </TableHeaderCell>
                                <TableHeaderCell textAlignment="text-center">
                                    論點數目
                                </TableHeaderCell>
                                <TableHeaderCell textAlignment="text-center">
                                    狀態
                                </TableHeaderCell>
                                <TableHeaderCell textAlignment="text-center">
                                    待審留言
                                </TableHeaderCell>
                                <TableHeaderCell textAlignment="text-center">
                                    {}
                                </TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {issues ? (
                                issues.map((issue, i, arr) => (
                                    <IssueRow
                                        key={i}
                                        ref={
                                            i === arr.length - 1
                                                ? lastRowRef
                                                : undefined
                                        }
                                        issue={issue}
                                    />
                                ))
                            ) : (
                                <IssueRowLoading />
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppShell>
    );
};

export default Issues;
