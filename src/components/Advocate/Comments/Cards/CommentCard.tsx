import { ActionIcon, Spoiler } from "@mantine/core";
import {
    AnnotationIcon,
    ArrowsExpandIcon,
    ChatIcon,
    ClockIcon,
} from "@heroicons/react/outline";

import AcceptActionPopover from "../AcceptActionPopover";
import DeleteActionPopover from "../DeleteActionPopover";

import type { ToModComments } from "../../../../types/advocate/comments.types";

interface CommentCardProps {
    data: ToModComments;
    removeCard: () => void;
    expandComment: () => void;
}

const CommentCard = ({ data, removeCard, expandComment }: CommentCardProps) => {
    return (
        <div className="flex min-h-[208px] w-full flex-col justify-between rounded-md border border-slate-100 p-3 shadow-sm">
            <div className="w-full">
                <div className="flex h-5 items-center gap-2 text-slate-500">
                    {data.type === "argument" ? (
                        <AnnotationIcon className="w-4" />
                    ) : (
                        <ChatIcon className="w-4 flex-shrink-0" />
                    )}
                    <p className="text-ellipsis text-sm line-clamp-1">
                        {data.type === "argument"
                            ? "論點"
                            : `回覆・${data.argument?.content}`}
                    </p>
                </div>
                <Spoiler
                    maxHeight={120}
                    showLabel="顯示完整留言"
                    hideLabel="隱藏"
                    className="my-2 px-1.5"
                    classNames={{
                        content: "text-base",
                        control: "text-slate-800 mt-2 text-xs",
                    }}
                >
                    {data.content}
                </Spoiler>
            </div>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    {data.type === "comment" && (
                        <ActionIcon onClick={expandComment}>
                            <ArrowsExpandIcon className="w-4" />
                        </ActionIcon>
                    )}
                    <div className="flex items-center gap-1 text-slate-500">
                        <ClockIcon className="w-4" />
                        <p className="text-sm">{data.daysRemaining}天</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <AcceptActionPopover
                        id={data.id}
                        type={data.type}
                        removeCard={removeCard}
                    />
                    <DeleteActionPopover
                        id={data.id}
                        type={data.type}
                        removeCard={removeCard}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
