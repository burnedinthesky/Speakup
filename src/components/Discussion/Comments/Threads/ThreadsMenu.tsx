import { ChatAlt2Icon, CheckIcon, PlusSmIcon } from "@heroicons/react/outline";
import { Button, Menu, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { ArgumentThread } from "../../../../types/comments.types";

interface ThreadsMenuProps {
    threads: ArgumentThread[];
    selectedThread: number | null;
    setSelectedThread: (id: number | null) => void;
    targetBtnColor?: string;
    setOpenNewThreadModal?: (value: boolean) => void;
}

const ThreadsMenu = ({
    threads,
    selectedThread,
    setSelectedThread,
    targetBtnColor,
    setOpenNewThreadModal,
}: ThreadsMenuProps) => {
    return (
        <>
            <Menu
                classNames={{
                    label: "py-0.5 px-2",
                    item: "py-0.5 px-2 text-neutral-700",
                    dropdown: "w-auto min-w-[128px] ",
                }}
            >
                <Menu.Target>
                    <button>
                        <ChatAlt2Icon
                            className={`h-6 w-6 ${
                                targetBtnColor
                                    ? targetBtnColor
                                    : "text-primary-800"
                            }`}
                        />
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
                    {setOpenNewThreadModal && (
                        <>
                            <Menu.Divider />
                            <Menu.Item
                                icon={<PlusSmIcon className="w-4" />}
                                onClick={() => {
                                    setOpenNewThreadModal(true);
                                }}
                            >
                                新增討論串
                            </Menu.Item>
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>
        </>
    );
};

export default ThreadsMenu;
