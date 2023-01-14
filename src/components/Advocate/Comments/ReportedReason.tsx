import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

import { LoadingOverlay, Popover, Progress } from "@mantine/core";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { trpc } from "utils/trpc";

interface ReportedReasonProps {
	id: number;
	type: "argument" | "comment";
}

const ReportedReason = ({ id, type }: ReportedReasonProps) => {
	const [opened, { close, open }] = useDisclosure(false);

	const { data, isLoading, refetch } =
		trpc.advocate.comments.reportReasons.useQuery(
			{ id, type },
			{ enabled: false },
		);

	useEffect(() => {
		if (opened) refetch();
	}, [opened]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div className="flex w-full items-center justify-between text-slate-500">
			<p className="text-xs ">為什麼本留言被檢舉？</p>
			<Popover
				opened={opened}
				classNames={{
					dropdown: "shadow-xl",
				}}
				position="top"
			>
				<Popover.Target>
					<button onMouseEnter={open} onMouseLeave={close}>
						<InformationCircleIcon className="w-4" />
					</button>
				</Popover.Target>
				<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
					<div
						className={`relative grid w-52 grid-cols-[1fr,3fr] items-center gap-2 ${
							isLoading ? "h-10" : "h-auto"
						}`}
					>
						<LoadingOverlay
							visible={isLoading}
							loaderProps={{ size: "sm", color: "gray" }}
						/>

						{data &&
							data.map((reason) => (
								<>
									<p className="text-sm">{reason.reason}</p>
									<Progress
										className="w-full"
										radius="md"
										value={reason.percentage}
									/>
								</>
							))}
					</div>
				</Popover.Dropdown>
			</Popover>
		</div>
	);
};

export default ReportedReason;
