import { useState, forwardRef } from "react";
import { trpc } from "../../../utils/trpc";
import { useInView } from "react-intersection-observer";

import { AnimatePresence, motion } from "framer-motion";
import { ReplyIcon, XIcon } from "@heroicons/react/outline";

import ArgumentCard from "./OpCards/ArgumentCard";
import { ShowRepliesButton } from "./OpDisplayComponents/ReplyAccessroies";
import ArgumentComments from "./ArgumentComments";
import CommentInput from "./Inputs/CommentInput";
import CreateThreadModal from "./Threads/CreateThreadModal";

import { Argument, ArgumentThread } from "../../../types/comments.types";

export interface ArgumentDisplayProps {
    data: Argument;
    deleteArgument: (commentId: number) => void;
}

const ArgumentDisplay = forwardRef<HTMLDivElement, ArgumentDisplayProps>(
    ({ data, deleteArgument }, ref) => {
        const [selectedThread, setSelectedThread] = useState<number | null>(
            null
        );
        const [showCommentInput, setShowCommentInput] =
            useState<boolean>(false);
        const [commentInputInAnim, setCommentInputInAnim] =
            useState<boolean>(false);

        const [openCreateThreadModal, setOpenCreateThreadModal] =
            useState<boolean>(false);
        const [addedThreads, setAddedThreads] = useState<ArgumentThread[]>([]);
        const [openCreateThreadModelCount, setOpenCreateThreadModalCount] =
            useState<number>(0);

        const { ref: argCardRef, inView: argCardInView } = useInView({
            threshold: 0.8,
        });

        const {
            data: cmtData,
            isLoading: cmtIsLoading,
            isFetched: cmtIsFetched,
            fetchNextPage: cmtFetchNextPage,
            hasNextPage: cmtHasNextPage,
            refetch: cmtRefetch,
            isFetching: cmtIsFetching,
        } = trpc.comments.getArgumentComments.useInfiniteQuery(
            {
                argumentId: data.id,
                limit: 20,
                sort: "",
                stance: "both",
                threadId: selectedThread,
            },
            {
                getNextPageParam: (lastPage) => lastPage?.nextCursor,
                enabled: false,
                // onSettled,
            }
        );

        const cmtDataFormatted = cmtData
            ? cmtData.pages.flat().flatMap((element) => element.retData)
            : [];

        return (
            <div className="w-full" ref={ref}>
                <ArgumentCard
                    data={data}
                    selectedThread={selectedThread}
                    setSelectedThread={(value) => {
                        cmtRefetch();
                        setSelectedThread(value);
                    }}
                    replyInputOpen={showCommentInput}
                    setReplyInputOpen={setShowCommentInput}
                    deleteFunction={deleteArgument}
                    ref={argCardRef}
                />
                <AnimatePresence>
                    <motion.div transition={{ height: "auto" }}>
                        <ArgumentComments data={cmtDataFormatted} />
                    </motion.div>
                </AnimatePresence>
                <div className="flex divide-x-[1px]">
                    {data.hasComments &&
                        (cmtIsFetched ? cmtHasNextPage : true) && (
                            <div className="px-2 pl-10">
                                <ShowRepliesButton
                                    fetchReplies={() => {
                                        cmtFetchNextPage();
                                    }}
                                    isLoading={cmtIsFetching}
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
                                    argumentId={data.id}
                                    threads={data.threads.concat(addedThreads)}
                                    viewingSelectedThread={selectedThread}
                                    setShowCommentInput={(val: boolean) => {
                                        if (!val) setCommentInputInAnim(true);
                                        setShowCommentInput(val);
                                    }}
                                    setOpenNewThreadModal={(val: boolean) => {
                                        if (val)
                                            setOpenCreateThreadModalCount(
                                                (cur) => cur + 1
                                            );
                                        setOpenCreateThreadModal(val);
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <CreateThreadModal
                        key={openCreateThreadModelCount}
                        opened={openCreateThreadModal}
                        setOpened={(val: boolean) => {
                            if (val)
                                setOpenCreateThreadModalCount((cur) => cur + 1);
                            setOpenCreateThreadModal(val);
                        }}
                        argumentId={data.id}
                        setAddedThreads={setAddedThreads}
                        comments={cmtDataFormatted}
                    />
                </div>
            </div>
        );
    }
);

ArgumentDisplay.displayName = "ArgumentDisplay";

export default ArgumentDisplay;
