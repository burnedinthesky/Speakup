import { trpc } from "../../../../utils/trpc";

import Link from "next/link";
import {
	Table,
	TableHead,
	TableHeaderCell,
	TableBody,
	TableRow,
	TableCell,
} from "@tremor/react";
import { Button } from "@mantine/core";

import { AppShell } from "../../../../components/Advocate/AppShell";

const PendingModIssues = () => {
	const { data, isLoading } =
		trpc.advocate.articles.pendingModeration.useQuery();

	return (
		<AppShell title="Speakup - 議題審核" highlight="issueMod">
			<div className="px-6 py-10 lg:ml-64 lg:px-12">
				<div className="flex w-full items-center justify-between">
					<h1 className="text-3xl font-bold">待審議題</h1>
				</div>
				<div className="mt-9 rounded-md lg:border lg:border-slate-300">
					<div className="w-full">
						{!data || data.length > 0 ? (
							<Table marginTop="mt-0">
								<TableHead>
									<TableRow>
										<TableHeaderCell textAlignment="text-left">
											標題
										</TableHeaderCell>
										<TableHeaderCell textAlignment="text-center">
											剩餘天數
										</TableHeaderCell>
										<TableHeaderCell textAlignment="text-center">
											{" "}
										</TableHeaderCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data ? (
										data.map((issue, i) => (
											<TableRow key={i}>
												<TableCell textAlignment="text-left">
													<Link href={`/advocate/issues/moderate/${issue.id}`}>
														<p>{issue.title}</p>
													</Link>
												</TableCell>
												<TableCell textAlignment="text-center">
													{issue.remainingDays}
												</TableCell>
												<TableCell textAlignment="text-center">
													<Link href={`/advocate/issues/moderate/${issue.id}`}>
														<Button variant="outline" compact>
															審核
														</Button>
													</Link>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell textAlignment="text-left">
												<div className="h-5 w-48 animate-pulse rounded-md bg-slate-300" />
											</TableCell>
											<TableCell textAlignment="text-center">
												<div className="mx-auto h-5 w-8 animate-pulse rounded-md bg-slate-300" />
											</TableCell>
											<TableCell textAlignment="text-center">{}</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						) : (
							<h2 className="my-4 text-center">目前沒有任何待審議題</h2>
						)}
					</div>
				</div>
			</div>
		</AppShell>
	);
};

export default PendingModIssues;
