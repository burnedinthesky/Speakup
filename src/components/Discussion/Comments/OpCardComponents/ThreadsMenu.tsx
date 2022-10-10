import { ChatAlt2Icon, CheckIcon } from "@heroicons/react/outline";
import { Menu } from "@mantine/core";
import { ArgumentThread } from "../../../../schema/comments.schema";

const ThreadIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="11.25" y="1" width="1.5" height="7" rx="0.75" fill="#4F777B" />
        <rect
            x="11.25"
            y="16"
            width="1.5"
            height="7"
            rx="0.75"
            fill="#4F777B"
        />
        <circle cx="12" cy="12" r="3" fill="#4F777B" />
    </svg>
);

interface ThreadsMenuProps {
    threads: ArgumentThread[];
    selectedThread: number | null;
    setSelectedThread: (id: number | null) => void;
}

const ThreadsMenu = ({
    threads,
    selectedThread,
    setSelectedThread,
}: ThreadsMenuProps) => {
    return (
        <Menu
            classNames={{
                label: "py-0.5 px-2",
                item: "py-0.5 px-2",
            }}
        >
            <Menu.Target>
                <button>
                    <ChatAlt2Icon className="h-6 w-6" />
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>選擇討論緒</Menu.Label>
                {threads.map((element, i) => (
                    <Menu.Item
                        key={i}
                        icon={
                            element.id == selectedThread ? (
                                <CheckIcon className="h-6 w-6 text-primary-600" />
                            ) : undefined
                        }
                        onClick={() => {
                            setSelectedThread(element.id);
                        }}
                    >
                        {element.name}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default ThreadsMenu;
