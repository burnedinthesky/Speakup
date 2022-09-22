import { useState, useEffect, forwardRef } from "react";

import { Comment, Stances, ThreadData } from "../../../schema/comments.schema";

import CommentCard from "./CommentCard/CommentCard";
import CommentResponseField from "./CommentResponseField";
import { ShowRepliesButton } from "./CommentCard/ReplyAccessroies";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

export interface CommandGroupProps {
    threadGroupId: number;
    data: ThreadData;
    deleteComment: (commentId: number, motherComment?: number) => void;
}

const ThreadDisplay = forwardRef<HTMLDivElement, CommandGroupProps>(
    ({ threadGroupId, data, deleteComment }, ref) => {
        const [userReplies, setUserReplies] = useState<Comment[]>([]);
        const [excludedIDs, setExcludedIDs] = useState<number[]>([]);

        const {
            data: tcQueryData,
            error,
            isLoading,
            fetchNextPage,
            hasNextPage,
            refetch,
            isFetched,
        } = trpc.useInfiniteQuery(
            [
                "threads.getThreadComments",
                {
                    threadId: data.id,
                    limit: 20,
                },
            ],
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
                enabled: false,
            }
        );

        console.log(
            data.leadComment.threadReplies !== undefined &&
                data.leadComment.threadReplies > 0 &&
                (isFetched ? hasNextPage : true)
        );

        useEffect(() => {
            if (tcQueryData) {
                let filteredIds = tcQueryData.pages
                    .flat()
                    .flatMap((element) => element.retData)
                    .map((item) => item.id);
                setUserReplies(
                    userReplies.filter(
                        (element) => !filteredIds.includes(element.id)
                    )
                );
            }
        }, [tcQueryData]);

        const addReplyMutation = trpc.useMutation("comments.createComment", {
            onSuccess: (data) => {
                setUserReplies((userReplies) => userReplies.concat([data]));
            },
            onError: () => {
                showNotification({
                    title: "發生未知錯誤",
                    message: "留言失敗，請再試一次",
                });
            },
        });

        const deleteCommentMutation = trpc.useMutation(
            "comments.deleteComment",
            {
                onSuccess: (data, variables) => {
                    setExcludedIDs(excludedIDs.concat([variables.id]));
                },
                onError: () => {
                    showNotification({
                        title: "發生未知錯誤",
                        message: "留言刪除失敗，請再試一次",
                    });
                },
            }
        );

        return (
            <div className="w-full" ref={ref}>
                <CommentCard
                    data={data.leadComment}
                    addReply={(content, stance) => {
                        addReplyMutation.mutate({
                            content: content,
                            stance: stance,
                            threadId: data.id,
                        });
                    }}
                    deleteFunction={deleteComment}
                />
                {tcQueryData && (
                    <div className="mt-2">
                        <CommentResponseField
                            commentId={data.id}
                            commentData={tcQueryData?.pages
                                .flat()
                                .flatMap((element) => element.retData)
                                .concat(userReplies)
                                .filter(
                                    (element) =>
                                        !excludedIDs.includes(element.id)
                                )}
                            deleteReply={(id) => {
                                deleteCommentMutation.mutate({
                                    id: id,
                                });
                            }}
                        />
                    </div>
                )}
                {data.leadComment.threadReplies !== undefined &&
                    data.leadComment.threadReplies > 0 &&
                    (isFetched ? hasNextPage : true) && (
                        <div className="pl-10">
                            <ShowRepliesButton
                                fetchReplies={() => {
                                    fetchNextPage();
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
            </div>
        );
    }
);

ThreadDisplay.displayName = "ThreadDisplay";

export default ThreadDisplay;
