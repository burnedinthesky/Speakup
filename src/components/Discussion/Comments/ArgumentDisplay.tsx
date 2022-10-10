import { useState, useEffect, forwardRef } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

import ArgumentCard from "./OpCards/ArgumentCard";
import { ShowRepliesButton } from "./OpDisplayComponents/ReplyAccessroies";
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
        const [selectedThread, setSelectedThread] = useState<number | null>(
            null
        );

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
                    addReply={(content, stance) => {
                        addCommentMutation.mutate({
                            content: content,
                            stance: stance,
                            argument: data.id,
                            thread: null,
                        });
                    }}
                    selectedThread={selectedThread}
                    setSelectedThread={(value) => {
                        setSelectedThread(value);
                    }}
                    deleteFunction={deleteComment}
                />
                {(dataSource || userReplies.length > 0) && (
                    <div className="mt-2">
                        <ArgumentComments
                            data={userReplies.concat(
                                dataSource ? dataSource : []
                            )}
                        />
                    </div>
                )}
                {data.hasComments && (acqIsFetched ? acqHasNextPage : true) && (
                    <div className="pl-10">
                        <ShowRepliesButton
                            fetchReplies={() => {
                                acqFetchNextPage();
                            }}
                            isLoading={acqIsLoading}
                        />
                    </div>
                )}
            </div>
        );
    }
);

ArgumentDisplay.displayName = "ArgumentDisplay";

export default ArgumentDisplay;
