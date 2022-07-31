import { Menu } from "@mantine/core";

import { FlagIcon, XIcon } from "@heroicons/react/solid";
import { TrashIcon, ReplyIcon, DotsVerticalIcon } from "@heroicons/react/outline";

import { Comment } from "../../../../types/commentTypes";

interface ExtendedMenuProps {
    cmtData: Comment;
    setShowReportMenu: (value: boolean) => void;
    deleteFunction: (value: number) => void;
    allowReply: boolean;
    showReplyBox: boolean;
    setShowReplyBox: (value: boolean) => void;
}

const ExtendedMenu = ({
    cmtData,
    setShowReportMenu,
    deleteFunction,
    allowReply,
    showReplyBox,
    setShowReplyBox,
}: ExtendedMenuProps) => {
    return (
        <Menu position="bottom-end">
            <Menu.Target>
                <DotsVerticalIcon className="h-6 w-6 text-neutral-500 cursor-pointer" />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => {
                        setShowReportMenu(true);
                    }}
                    className="text-primary-800"
                    icon={<FlagIcon className="inline h-6 w-6 text-primary-800" />}
                >
                    檢舉
                </Menu.Item>
                {cmtData.isOwner && (
                    <Menu.Item
                        onClick={() => {
                            deleteFunction(cmtData.id);
                        }}
                        className="text-primary-800"
                        icon={<TrashIcon className="inline h-6 w-6 text-primary-800" />}
                    >
                        刪除
                    </Menu.Item>
                )}
                {allowReply && (
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
