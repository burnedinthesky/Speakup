import { useState, useEffect, forwardRef } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

import { AnimatePresence, motion } from "framer-motion";

import ArgumentCard from "./OpCards/ArgumentCard";
import { ShowRepliesButton } from "./OpDisplayComponents/ReplyAccessroies";
import ArgumentComments from "./ArgumentComments";

import { useInView } from "react-intersection-observer";

import {
    Argument,
    ArgumentThread,
    Comment,
} from "../../../schema/comments.schema";
import CommentInput from "./Inputs/CommentInput";
import { ReplyIcon, XIcon } from "@heroicons/react/outline";

export interface ArgumentDisplay {
    data: Argument;
    deleteArgument: (commentId: number) => void;
}

const ArgumentDisplay = forwardRef<HTMLDivElement, ArgumentDisplay>(
    ({ data, deleteArgument }, ref) => {
        const [userReplies, setUserReplies] = useState<Comment[]>([]);
        const [excludedIDs, setExcludedIDs] = useState<number[]>([]);
        const [selectedThread, setSelectedThread] = useState<number | null>(
            null
        );
        const [showCommentInput, setShowCommentInput] =
            useState<boolean>(false);
        const [commentInputInAnim, setCommentInputInAnim] =
            useState<boolean>(false);

        const [addedThreads, setAddedThreads] = useState<ArgumentThread[]>([]);

        const { ref: argCardRef, inView: argCardInView } = useInView({
            threshold: 0.8,
        });

        const {
            data: acqData,
            isLoading: acqIsLoading,
            isFetched: acqIsFetched,
            fetchNextPage: acqFetchNextPage,
            hasNextPage: acqHasNextPage,
        } = trpc.useInfiniteQuery(
            [
                "comments.getArgumentComments",
                {
                    argumentId: data.id,
                    limit: 20,
                    sort: "",
                    stance: "both",
                },
            ],
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                enabled: false,
            }
        );

        const { data: thqData, refetch: thqRefetch } = trpc.useQuery(
            [
                "comments.getThreadComments",
                {
                    argumentId: data.id,
                    threadId: selectedThread,
                },
            ],
            {
                enabled: false,
            }
        );

        const createThreadMutation = trpc.useMutation(
            "arguments.createNewThread",
            {
                onSuccess: (data) => {
                    setAddedThreads((cur) =>
                        cur.map((element) =>
                            element.id == -1 ? data : element
                        )
                    );
                },
                onError: () => {
                    setAddedThreads((cur) =>
                        cur.filter((element) => element.id !== -1)
                    );
                    showNotification({
                        title: "發生未知錯誤",
                        message: "討論串建立失敗，請再試一次",
                        color: "red",
                    });
                },
                onMutate: (data) => {
                    setAddedThreads((cur) =>
                        cur.concat([
                            {
                                id: -1,
                                argumentId: data.argumentId,
                                name: data.name,
                            },
                        ])
                    );
                },
            }
        );

        useEffect(() => {
            if (acqData) {
                let filteredIds = acqData.pages
                    .flat()
                    .flatMap((element) => element.retData)
                    .map((item) => item.id);
                setUserReplies(
                    userReplies.filter(
                        (element) => !filteredIds.includes(element.id)
                    )
                );
            }
        }, [acqData]);

        useEffect(() => {
            thqRefetch();
        }, [selectedThread]);

        const addCommentMutation = trpc.useMutation("comments.createComment", {
            onSuccess: (data) => {
                setUserReplies((userReplies) => userReplies.concat([data]));
            },
            onError: (error) => {
                console.log(error);
                showNotification({
                    title: "發生未知錯誤",
                    message: "留言失敗，請再試一次",
                    color: "red",
                });
            },
        });

        const acqDataFormatted = (
            acqData
                ? acqData.pages.flat().flatMap((element) => element.retData)
                : []
        ).filter((element) => !excludedIDs.includes(element.id));

        const dataSource = selectedThread === null ? acqDataFormatted : thqData;

        return (
            <div className="w-full" ref={ref}>
                <ArgumentCard
                    data={data}
                    selectedThread={selectedThread}
                    setSelectedThread={(value) => {
                        setSelectedThread(value);
                    }}
                    replyInputOpen={showCommentInput}
                    setReplyInputOpen={setShowCommentInput}
                    deleteFunction={deleteArgument}
                    ref={argCardRef}
                />
                <AnimatePresence>
                    {(dataSource || userReplies.length > 0) && (
                        <motion.div transition={{ height: "auto" }}>
                            <ArgumentComments
                                data={userReplies.concat(
                                    dataSource ? dataSource : []
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex divide-x-[1px]">
                    {data.hasComments &&
                        (acqIsFetched ? acqHasNextPage : true) && (
                            <div className="px-2 pl-10">
                                <ShowRepliesButton
                                    fetchReplies={() => {
                                        acqFetchNextPage();
                                    }}
                                    isLoading={acqIsLoading}
                                />
                            </div>
                        )}
                    {!argCardInView && (
                        <button
                            className="flex items-start gap-1 px-2 text-neutral-500"
                            onClick={() => {
                                setShowCommentInput((cur) => !cur);
                            }}
                        >
                            {showCommentInput ? (
                                <XIcon className="inline h-5 w-5 rotate-180" />
                            ) : (
                                <ReplyIcon className="inline h-5 w-5 rotate-180" />
                            )}
                            <p className="inline text-sm">
                                {showCommentInput ? "關閉" : "回覆"}
                            </p>
                        </button>
                    )}
                </div>
                <div
                    className={`${
                        commentInputInAnim ? "overflow-y-hidden" : ""
                    }`}
                >
                    <AnimatePresence>
                        {showCommentInput && (
                            <motion.div
                                initial={{ translateY: -40 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: -40 }}
                                transition={{
                                    bounce: 0,
                                    ease: "easeOut",
                                    duration: 0.2,
                                }}
                                onAnimationStart={() => {
                                    setCommentInputInAnim(true);
                                }}
                                onAnimationComplete={() => {
                                    setCommentInputInAnim(false);
                                }}
                            >
                                <CommentInput
                                    addComment={(content, stance, thread) => {
                                        addCommentMutation.mutate({
                                            content: content,
                                            stance: stance,
                                            thread: thread,
                                            argument: data.id,
                                        });
                                    }}
                                    threads={data.threads.concat(addedThreads)}
                                    setShowReplyBox={(val: boolean) => {
                                        if (!val) setCommentInputInAnim(true);
                                        setShowCommentInput(val);
                                    }}
                                    addNewThread={(name: string) => {
                                        createThreadMutation.mutate({
                                            argumentId: data.id,
                                            name: name,
                                        });
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
);

ArgumentDisplay.displayName = "ArgumentDisplay";

export default ArgumentDisplay;
