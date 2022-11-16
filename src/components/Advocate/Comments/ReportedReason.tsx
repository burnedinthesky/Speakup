import { InformationCircleIcon } from "@heroicons/react/outline";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const ReportedReason = () => {
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <div className="flex w-full items-center justify-between text-slate-500">
            <p className="text-xs ">為什麼本留言被檢舉？</p>
            <Popover
                opened={opened}
                classNames={{
                    dropdown: "shadow-xl",
                }}
            >
                <Popover.Target>
                    <button onMouseEnter={open} onMouseLeave={close}>
                        <InformationCircleIcon className="w-4" />
                    </button>
                </Popover.Target>
                <Popover.Dropdown>
                    <p></p>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
};

export default ReportedReason;
