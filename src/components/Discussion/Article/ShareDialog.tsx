import React from "react";
import { Modal } from "@mantine/core";
import { CheckIcon, ClipboardCopyIcon, LinkIcon } from "@heroicons/react/outline";
import { CopyButton, ActionIcon, Tooltip } from "@mantine/core";

interface ShareDialogProps {
    opened: boolean;
    closeFn: () => void;
    url: string;
}

const ShareDialog = ({ opened, closeFn, url }: ShareDialogProps) => {
    return (
        <Modal opened={opened} onClose={closeFn} size="sm" centered title="分享這篇議題">
            <div>
                <div className="border-2 mt-4 border-neutral-400 rounded-md flex h-10 items-center px-2">
                    <div className="flex items-center flex-shrink-0 justify-center">
                        <LinkIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div className="mx-1 border-neutral-400 h-full " />
                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <p className="text-neutral-800 whitespace-nowrap">{url}</p>
                    </div>
                    <div className="mx-2 border-neutral-400 h-full " />
                    <div className="flex items-center flex-shrink-0 justify-center">
                        <CopyButton value={url} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                                    <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                                        {copied ? (
                                            <CheckIcon className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <ClipboardCopyIcon className="h-5 w-5" />
                                        )}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShareDialog;
