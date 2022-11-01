import { Menu } from "@mantine/core";

import { XIcon } from "@heroicons/react/solid";
import { FlagIcon } from "@heroicons/react/outline";
import {
    TrashIcon,
    ReplyIcon,
    DotsVerticalIcon,
} from "@heroicons/react/outline";
import { useSetRecoilState } from "recoil";
import { openDisccusionModal } from "../../../../atoms/discussionModal";

interface ExtendedMenuProps {
    dataId: number;
    isAuthor: boolean;
    deleteFunction: (value: number) => void;
    allowReply: boolean;
    showReplyBox?: boolean;
    setShowReplyBox?: (value: boolean) => void;
}

const ExtendedMenu = ({
    dataId,
    isAuthor,
    deleteFunction,
    allowReply,
    showReplyBox,
    setShowReplyBox,
}: ExtendedMenuProps) => {
    const setReportModalData = useSetRecoilState(openDisccusionModal);

    return (
        <Menu position="bottom-end">
            <Menu.Target>
                <DotsVerticalIcon className="h-6 w-6 cursor-pointer text-neutral-500" />
            </Menu.Target>
            <Menu.Dropdown>
                {!isAuthor && (
                    <Menu.Item
                        onClick={() => {
                            setReportModalData({
                                opened: true,
                                identifier: dataId,
                                type: allowReply ? "argument" : "comment",
                            });
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

                {allowReply &&
                    showReplyBox !== undefined &&
                    setShowReplyBox !== undefined && (
                        <Menu.Item
                            onClick={() => {
                                setShowReplyBox(!showReplyBox);
                            }}
                            className="text-primary-800 xl:hidden"
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
