import { Modal } from "@mantine/core";
import {
    CheckIcon,
    ClipboardCopyIcon,
    LinkIcon,
} from "@heroicons/react/outline";
import { CopyButton, ActionIcon, Tooltip } from "@mantine/core";

interface ShareDialogProps {
    opened: boolean;
    closeFn: () => void;
    url: string;
}

const ShareDialog = ({ opened, closeFn, url }: ShareDialogProps) => {
    return (
        <Modal
            opened={opened}
            onClose={closeFn}
            size="sm"
            centered
            title="分享這篇議題"
        >
            <div>
                <div className="mt-4 flex h-10 items-center rounded-md border-2 border-neutral-400 px-2">
                    <div className="flex flex-shrink-0 items-center justify-center">
                        <LinkIcon className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div className="mx-1 h-full border-neutral-400 " />
                    <div className="w-full overflow-x-auto scrollbar-hide">
                        <p className="whitespace-nowrap text-neutral-800">
                            {url}
                        </p>
                    </div>
                    <div className="mx-2 h-full border-neutral-400 " />
                    <div className="flex flex-shrink-0 items-center justify-center">
                        <CopyButton value={url} timeout={2000}>
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={copied ? "Copied" : "Copy"}
                                    withArrow
                                    position="right"
                                >
                                    <ActionIcon
                                        color={copied ? "teal" : "gray"}
                                        onClick={copy}
                                    >
                                        {copied ? (
                                            <CheckIcon className="h-5 w-5 text-green-500" />
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
