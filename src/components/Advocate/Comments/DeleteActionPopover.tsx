import { useDisclosure } from "@mantine/hooks";

import { ActionIcon, Button, Checkbox, Popover } from "@mantine/core";
import { TrashIcon } from "@heroicons/react/outline";
import ReportedReason from "./ReportedReason";

import { ReportConfigs } from "../../../common/components/Report/ReportMenu/reportConfigs";
import { trpc } from "../../../utils/trpc";
import { showErrorNotification } from "../../../lib/errorHandling";
import { useState } from "react";
import DeleteReasonDropdown from "./DeleteReasonDropdown";

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

    const [violatedRules, setViolatedRules] = useState<string[]>([]);

    const deleteCommentMutation = trpc.useMutation(
        ["advocate.comments.deleteComment"],
        {
            onSuccess: () => {
                removeCard();
            },
            onError: () => {
                showErrorNotification({ message: "請再試一次" });
            },
        }
    );

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
                        type={type}
                        violatedRules={violatedRules}
                        setViolatedRules={setViolatedRules}
                        deleteComment={() => {
                            deleteCommentMutation.mutate({
                                id,
                                type,
                                instance: "first",
                                reasons: violatedRules,
                            });
                        }}
                    />
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};

export default DeleteActionPopover;
