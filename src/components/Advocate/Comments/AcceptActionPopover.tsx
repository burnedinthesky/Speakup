import { useDisclosure } from "@mantine/hooks";

import { ActionIcon, Popover } from "@mantine/core";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";

interface AcceptActionPopoverProps {
    removeCard: () => void;
}

const AcceptActionPopover = ({ removeCard }: AcceptActionPopoverProps) => {
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
                    <CheckCircleIcon className="w-4" />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <p className="text-sm text-slate-600">
                    我確定本留言符合Speakup留言規範
                </p>
                <div className="mt-1 flex w-full items-center justify-end">
                    <ActionIcon onClick={close}>
                        <XCircleIcon className="w-5" />
                    </ActionIcon>
                    <ActionIcon onClick={removeCard}>
                        <CheckCircleIcon className="w-5" />
                    </ActionIcon>
                </div>
            </Popover.Dropdown>
        </Popover>
    );
};

export default AcceptActionPopover;
