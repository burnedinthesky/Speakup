import { useDisclosure } from "@mantine/hooks";

import { ActionIcon, LoadingOverlay, Popover } from "@mantine/core";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { trpc } from "utils/trpc";
import { showErrorNotification } from "lib/errorHandling";

interface AcceptActionPopoverProps {
	id: number;
	type: "argument" | "comment";
	removeCard: () => void;
}

const AcceptActionPopover = ({
	id,
	type,
	removeCard,
}: AcceptActionPopoverProps) => {
	const [opened, { close, open }] = useDisclosure(false);

	const clearCommentReportMutation =
		trpc.advocate.comments.clearCommentReports.useMutation({
			onSuccess: () => {
				removeCard();
			},
			onError: () => {
				showErrorNotification({ message: "請再試一次" });
			},
		});

	return (
		<Popover
			opened={opened}
			onClose={close}
			classNames={{
				dropdown: "shadow-xl",
			}}
		>
			<Popover.Target>
				<ActionIcon onClick={open}>
					<CheckCircleIcon className="w-4" />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				<div className="relative w-full">
					<LoadingOverlay
						loaderProps={{ color: "gray", size: "sm" }}
						visible={clearCommentReportMutation.isLoading}
					/>
					<p className="text-sm text-slate-600">
						我確定本留言符合Speakup留言規範
					</p>
					<div className="mt-1 flex w-full items-center justify-end">
						<ActionIcon onClick={close}>
							<XCircleIcon className="w-5" />
						</ActionIcon>
						<ActionIcon
							onClick={() => {
								clearCommentReportMutation.mutate({ id, type });
							}}
						>
							<CheckCircleIcon className="w-5" />
						</ActionIcon>
					</div>
				</div>
			</Popover.Dropdown>
		</Popover>
	);
};

export default AcceptActionPopover;
