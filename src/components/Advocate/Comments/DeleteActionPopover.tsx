import { useDisclosure } from "@mantine/hooks";

import { ActionIcon, Button, Checkbox, Popover } from "@mantine/core";
import { TrashIcon } from "@heroicons/react/outline";
import ReportedReason from "./ReportedReason";

import { ReportConfigs } from "../../../common/components/Report/ReportMenu/reportConfigs";

interface DeleteActionPopoverProps {
    removeCard: () => void;
}

const DeleteActionPopover = ({ removeCard }: DeleteActionPopoverProps) => {
    const [opened, { close, open }] = useDisclosure(false);

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
                    <h3 className="text-sm font-bold">移除原因</h3>
                    <div className="mt-3 flex flex-wrap gap-1">
                        {ReportConfigs["argument"]?.options.map((option, i) => (
                            <Checkbox
                                key={i}
                                size="sm"
                                value={option.key}
                                label={option.text}
                            />
                        ))}
                    </div>
                    <div className="flex w-full justify-end gap-2">
                        <Button
                            size="xs"
                            radius="xl"
                            color="gray"
                            variant="light"
                            onClick={close}
                        >
                            取消
                        </Button>
                        <Button
                            size="xs"
                            radius="xl"
                            className="bg-primary-600"
                            onClick={removeCard}
                        >
                            移除
                        </Button>
                    </div>
                    <hr className="my-2 w-full border-b border-b-slate-300 px-3" />
                    <ReportedReason />
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};

export default DeleteActionPopover;
