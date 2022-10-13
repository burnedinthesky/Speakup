import {
    ChatAlt2Icon,
    CheckIcon,
    PlusIcon,
    PlusSmIcon,
} from "@heroicons/react/outline";
import { Button, Menu, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { ArgumentThread } from "../../../../schema/comments.schema";

interface AddThreadModalProps {
    opened: boolean;
    setOpened: (value: boolean) => void;
    addNewThread: (name: string) => void;
}

const AddThreadModal = ({
    opened,
    setOpened,
    addNewThread,
}: AddThreadModalProps) => {
    const [threadName, setThreadName] = useState<string>("");
    const [inputError, setInputError] = useState<string | null>(null);

    const submitName = () => {
        setInputError(null);
        if (threadName.length < 2) {
            setInputError("名稱過短");
        } else if (threadName.length > 8) {
            setInputError("名稱過長，請輸入八個字內");
        } else {
            addNewThread(threadName);
            setOpened(false);
        }
    };

    return (
        <Modal
            centered
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            title="新增討論串"
        >
            <TextInput
                value={threadName}
                onChange={(e) => setThreadName(e.currentTarget.value)}
                error={inputError}
                placeholder="請輸入討論串名稱"
            />
            <div className="mt-2 flex w-full justify-end">
                <Button
                    className="bg-primary-600 font-normal"
                    onClick={() => {
                        submitName();
                    }}
                >
                    新增
                </Button>
            </div>
        </Modal>
    );
};

interface ThreadsMenuProps {
    threads: ArgumentThread[];
    selectedThread: number | null;
    setSelectedThread: (id: number | null) => void;
    addNewThread?: (name: string) => void;
    targetBtnColor?: string;
}

const ThreadsMenu = ({
    threads,
    selectedThread,
    setSelectedThread,
    addNewThread,
    targetBtnColor,
}: ThreadsMenuProps) => {
    const [openNewThreadModel, setOpenNewThreadModal] =
        useState<boolean>(false);

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
                    {addNewThread && (
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
            {addNewThread && (
                <AddThreadModal
                    opened={openNewThreadModel}
                    setOpened={setOpenNewThreadModal}
                    addNewThread={addNewThread}
                />
            )}
        </>
    );
};

export default ThreadsMenu;
