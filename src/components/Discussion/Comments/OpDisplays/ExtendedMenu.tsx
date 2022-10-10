import { Menu } from "@mantine/core";

import { XIcon } from "@heroicons/react/solid";
import { FlagIcon } from "@heroicons/react/outline";
import {
    TrashIcon,
    ReplyIcon,
    DotsVerticalIcon,
} from "@heroicons/react/outline";

interface ExtendedMenuProps {
    dataId: number;
    isAuthor: boolean;
    setShowReportMenu: (value: boolean) => void;
    deleteFunction: (value: number) => void;
    allowReply: boolean;
    showReplyBox?: boolean;
    setShowReplyBox?: (value: boolean) => void;
}

const ExtendedMenu = ({
    dataId,
    isAuthor,
    setShowReportMenu,
    deleteFunction,
    allowReply,
    showReplyBox,
    setShowReplyBox,
}: ExtendedMenuProps) => {
    return (
        <Menu position="bottom-end">
            <Menu.Target>
                <DotsVerticalIcon className="h-6 w-6 cursor-pointer text-neutral-500" />
            </Menu.Target>
            <Menu.Dropdown>
                {!isAuthor && (
                    <Menu.Item
                        onClick={() => {
                            setShowReportMenu(true);
                        }}
                        className="text-primary-800"
                        icon={
                            <FlagIcon className="inline h-6 w-6 text-primary-800" />
                        }
                    >
                        檢舉
                    </Menu.Item>
                )}
                {isAuthor && (
                    <Menu.Item
                        onClick={() => {
                            deleteFunction(dataId);
                        }}
                        className="text-primary-800"
                        icon={
                            <TrashIcon className="inline h-6 w-6 text-primary-800" />
                        }
                    >
                        刪除
                    </Menu.Item>
                )}
                {allowReply && showReplyBox && setShowReplyBox && (
                    <Menu.Item
                        onClick={() => {
                            setShowReplyBox(!showReplyBox);
                        }}
                        className="text-primary-800 lg:hidden"
                        icon={
                            showReplyBox ? (
                                <XIcon className="inline h-6 w-6 text-primary-800" />
                            ) : (
                                <ReplyIcon className="inline h-6 w-6 text-primary-800" />
                            )
                        }
                    >
                        {showReplyBox ? "取消" : "回覆"}
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default ExtendedMenu;
