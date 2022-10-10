import { useState, useEffect, forwardRef } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

import ArgumentCard from "./OpDisplays/ArgumentCard";
import { ShowRepliesButton } from "./OpDisplays/ReplyAccessroies";
import ArgumentComments from "./ArgumentComments";

import { Argument, Comment } from "../../../schema/comments.schema";

export interface ArgumentDisplay {
    data: Argument;
    deleteComment: (commentId: number, motherComment?: number) => void;
}

const ArgumentDisplay = forwardRef<HTMLDivElement, ArgumentDisplay>(
    ({ data, deleteComment }, ref) => {
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

        const addCommentMutation = trpc.useMutation("comments.createComment", {
            onSuccess: (data) => {
                setUserReplies((userReplies) => userReplies.concat([data]));
            },
            onError: (error) => {
                console.log(error);
                showNotification({
                    title: "發生未知錯誤",
                    message: "留言失敗，請再試一次",
                });
            },
        });

        return (
            <div className="w-full" ref={ref}>
                <ArgumentCard
                    data={data}
                    addReply={(content, stance) => {
                        addCommentMutation.mutate({
                            content: content,
                            stance: stance,
                            argument: data.id,
                            thread: null,
                        });
                    }}
                    deleteFunction={deleteComment}
                />
                {(tcQueryData || userReplies.length > 0) && (
                    <div className="mt-2">
                        <ArgumentComments
                            data={(tcQueryData
                                ? tcQueryData.pages
                                      .flat()
                                      .flatMap((element) => element.retData)
                                : []
                            )
                                .concat(userReplies)
                                .filter(
                                    (element) =>
                                        !excludedIDs.includes(element.id)
                                )}
                        />
                    </div>
                )}
                {data.hasComments && (isFetched ? hasNextPage : true) && (
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

ArgumentDisplay.displayName = "ArgumentDisplay";

export default ArgumentDisplay;
