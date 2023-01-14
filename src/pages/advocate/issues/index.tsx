import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useInView } from "react-intersection-observer";

import Link from "next/link";

import { Button } from "@mantine/core";
import { PlusIcon } from "@heroicons/react/outline";

import { AppShell } from "../../../components/Advocate/AppShell";
import IssueRow from "../../../components/Advocate/Issues/Viewing/IssueRow";
import IssueRowLoading from "../../../components/Advocate/Issues/Viewing/IssueRowLoading";
import ArticleCard from "../../../components/Advocate/Issues/Viewing/ArticleCard";
import useScreenSize from "hooks/common/useScreenSize";
import ArticleCardLoading from "../../../components/Advocate/Issues/Viewing/ArticleCardLoading";

const Issues = () => {
	const { data, isLoading, hasNextPage, fetchNextPage } =
		trpc.advocate.articles.allArticles.useInfiniteQuery({ limit: 20 });

	const issues = data?.pages.flatMap((page) => page.data);

	const sz = useScreenSize();

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
			<div className="px-6 py-10 lg:ml-64 lg:px-12">
				<div className="flex w-full items-center justify-between">
					<h1 className="text-3xl font-bold">您的議題</h1>
					<Link href="/advocate/issues/new">
						<Button
							className="bg-primary-600"
							leftIcon={<PlusIcon className="h-4" />}
						>
							新增議題
						</Button>
					</Link>
				</div>
				<div className="mt-9 rounded-md lg:border lg:border-slate-300">
					<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
						{issues ? (
							issues.map((issue, i, arr) => (
								<ArticleCard
									key={i}
									ref={
										i === arr.length - 1 && sz < 1024 ? lastRowRef : undefined
									}
									issue={issue}
								/>
							))
						) : (
							<ArticleCardLoading />
						)}
					</div>
					<div className="hidden w-full lg:block">
						<table className="w-full">
							<thead>
								<tr className="text-sm ">
									<th className="pl-6 text-left py-3">標題</th>
									<th>標籤</th>
									<th>論點數目</th>
									<th>狀態</th>
									<th>待審留言</th>
									<th className="pr-6">{}</th>
								</tr>
							</thead>
							<tbody>
								{issues ? (
									issues.map((issue, i, arr) => (
										<IssueRow
											key={i}
											ref={
												i === arr.length - 1 && sz >= 1024
													? lastRowRef
													: undefined
											}
											issue={issue}
										/>
									))
								) : (
									<IssueRowLoading />
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</AppShell>
	);
};

export default Issues;
