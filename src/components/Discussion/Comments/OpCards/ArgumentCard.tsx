import { useState, forwardRef } from "react";

import { ReplyIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

import { CommentReactionButtons } from "../OpCardComponents/CommentReactionButtons";
import ExtendedMenu from "../OpCardComponents/ExtendedMenu";

import ThreadsMenu from "../Threads/ThreadsMenu";

import { Argument } from "../../../../types/comments.types";
import useLoggedInAction from "../../../../hooks/authProtected/useLoggedInAction";
import { useSession } from "next-auth/react";
import { Avatar } from "@mantine/core";
import PfLinkedUsername from "../../../User/Profile/PfLinkedUsername";

interface ArgumentCardProps {
    data: Argument;
    selectedThread: number | null;
    setSelectedThread: (id: number | null) => void;
    replyInputOpen: boolean;
    setReplyInputOpen: (value: boolean) => void;
    deleteFunction: (commentId: number, motherComment?: number) => void;
}

const ArgumentCard = forwardRef<HTMLDivElement, ArgumentCardProps>(
    (
        {
            data,
            selectedThread,
            setSelectedThread,
            replyInputOpen,
            setReplyInputOpen,
            deleteFunction,
        },
        ref
    ) => {
        const [enableAnim, setEnableAnim] = useState<boolean>(false);

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

        const { data: session } = useSession();
        const logInAction = useLoggedInAction();

        const borderColor = (stance: string) =>
            stance === "sup" || true
                ? "border-green-300"
                : stance === "agn"
                ? "border-red-400"
                : "border-neutral-300";

        return (
            <>
                <div className="flex w-full gap-3" ref={ref}>
                    <Avatar
                        classNames={{
                            root: `border-2 ${borderColor(data.stance)}`,
                        }}
                        className="border-2"
                        src={data.author.profileImg}
                        alt="Profile"
                        radius="xl"
                        size="md"
                    >
                        {data.author.name}
                    </Avatar>
                    <div className="flex-grow">
                        <PfLinkedUsername
                            id={data.author.id}
                            username={data.author.name}
                            reputation={data.author.reputation}
                        />
                        <p className="mt-2 mb-3 text-base text-neutral-700">
                            {data.content}
                        </p>

                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex h-6 items-center gap-3">
                                <CommentReactionButtons
                                    data={data}
                                    cardType="argument"
                                    enableAnim={enableAnim}
                                    setEnableAnim={setEnableAnim}
                                    interaction={interaction}
                                    setInteraction={setInteraction}
                                />

                                <button
                                    className=" hidden -translate-y-[1px] text-neutral-500 xl:block"
                                    onClick={() => {
                                        logInAction(() => {
                                            setReplyInputOpen(!replyInputOpen);
                                        });
                                    }}
                                >
                                    {replyInputOpen ? (
                                        <XIcon className="inline h-6 w-6" />
                                    ) : (
                                        <ReplyIcon className="inline h-6 w-6" />
                                    )}
                                </button>

                                {data.threads.length > 0 && (
                                    <div className="block translate-y-[1px] text-neutral-500">
                                        <ThreadsMenu
                                            threads={data.threads}
                                            selectedThread={selectedThread}
                                            setSelectedThread={(
                                                id: number | null
                                            ) => {
                                                setSelectedThread(
                                                    id === selectedThread
                                                        ? null
                                                        : id
                                                );
                                            }}
                                            targetBtnColor="text-neutral-500"
                                        />
                                    </div>
                                )}
                            </div>
                            {session && (
                                <div>
                                    <ExtendedMenu
                                        dataId={data.id}
                                        isAuthor={data.isAuthor}
                                        deleteFunction={deleteFunction}
                                        allowReply={true}
                                        showReplyBox={replyInputOpen}
                                        setShowReplyBox={setReplyInputOpen}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

ArgumentCard.displayName = "ArgumentCard";

export default ArgumentCard;
