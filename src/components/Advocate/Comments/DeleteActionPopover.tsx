import { useDisclosure } from "@mantine/hooks";

import { ActionIcon, Popover } from "@mantine/core";
import { TrashIcon } from "@heroicons/react/outline";
import DeleteReasonDropdown from "./DeleteReasonDropdown";

import { trpc } from "utils/trpc";
import { showErrorNotification } from "lib/errorHandling";

interface DeleteActionPopoverProps {
	id: number;
	type: "argument" | "comment";
	removeCard: () => void;
}

const DeleteActionPopover = ({
	id,
	type,
	removeCard,
}: DeleteActionPopoverProps) => {
	const [opened, { close, open }] = useDisclosure(false);

	const deleteCommentMutation =
		trpc.advocate.comments.deleteComment.useMutation({
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
					<TrashIcon className="w-4" />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown>
				<div className="w-64">
					<DeleteReasonDropdown
						id={id}
						type={type}
						deleteComment={(reasons: string[]) => {
							deleteCommentMutation.mutate({
								id,
								type,
								instance: "first",
								reasons: reasons,
							});
						}}
					/>
				</div>
			</Popover.Dropdown>
		</Popover>
	);
};

export default DeleteActionPopover;
