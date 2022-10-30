import { useState, forwardRef } from "react";

import { CommentReactionButtons } from "../OpCardComponents/CommentReactionButtons";
import ExtendedMenu from "../OpCardComponents/ExtendedMenu";

import { Comment } from "../../../../types/comments.types";
import { Badge } from "@mantine/core";
import { ChatAlt2Icon } from "@heroicons/react/outline";

interface CommentCardProps {
    data: Comment;
    deleteFunction: (commentId: number, motherComment?: number) => void;
}

const CommentCard = forwardRef<HTMLDivElement, CommentCardProps>(
    ({ data, deleteFunction }, ref) => {
        const [interaction, setInteraction] = useState<
            "liked" | "supported" | "disliked" | null
        >(
            data.userLiked
                ? "liked"
                : data.userSupported
                ? "supported"
                : data.userDisliked
                ? "disliked"
                : null
        );

        const [enableAnim, setEnableAnim] = useState<boolean>(false);

        return (
            <>
                <div className="flex w-full gap-3" ref={ref}>
                    <img
                        className={`h-7 w-7 flex-shrink-0 border-2 p-1 ${
                            data.stance === "sup"
                                ? "border-green-300"
                                : data.stance === "agn"
                                ? "border-red-400"
                                : "border-neutral-300"
                        } overflow-hidden rounded-full`}
                        src={data.author.profileImg}
                        alt="Profile"
                    />
                    <div className="flex-grow">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base text-primary-800">
                                {data.author.name}
                            </h3>
                            <div className="h-[18px] w-24 md:w-36">
                                {data.thread && (
                                    <Badge
                                        leftSection={
                                            <ChatAlt2Icon className="h-4 w-4" />
                                        }
                                    >
                                        {data.thread.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="mt-2 mb-3 text-base text-neutral-700">
                            {data.content}
                        </p>

                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex h-6">
                                <CommentReactionButtons
                                    data={data}
                                    cardType="comment"
                                    enableAnim={enableAnim}
                                    setEnableAnim={setEnableAnim}
                                    interaction={interaction}
                                    setInteraction={setInteraction}
                                />
                            </div>
                            <div>
                                <ExtendedMenu
                                    dataId={data.id}
                                    isAuthor={data.isAuthor}
                                    deleteFunction={deleteFunction}
                                    allowReply={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

CommentCard.displayName = "CommentCard";

export default CommentCard;
