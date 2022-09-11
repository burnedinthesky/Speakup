import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import ThreadDisplay from "./ThreadDisplay";
import {
    NewComment,
    NoCommentsDisplay,
    LoadingSkeleton,
} from "./CommentAccessories";
import { Stances, ThreadData } from "../../../schema/comments.schema";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

interface CommentFieldProps {
    threadGroupId: number;
    onSide: "sup" | "agn" | "both";
    sortMethod: "default" | "time" | "replies";
}

const CommentField = ({
    threadGroupId,
    onSide,
    sortMethod,
}: CommentFieldProps) => {
    const [userComments, setUserComments] = useState<ThreadData[]>([]);
    const { ref: lastCardRef, inView: lastCardInView, entry } = useInView();

    const {
        data,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetching,
        refetch,
    } = trpc.useInfiniteQuery(
        [
            "threads.tg.firstComment",
            {
                TGID: threadGroupId,
                stance: onSide,
                sort: "",
                limit: 20,
            },
        ],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        if (entry !== undefined) {
            if (entry.isIntersecting && hasNextPage && !isLoading) {
                fetchNextPage();
            }
        }
    }, [lastCardInView]);

    const addThreadMutation = trpc.useMutation("threads.addComment", {
        onSuccess: (data) => {
            setUserComments(userComments.concat(data));
        },
        onError: (error, variables) => {
            showNotification({
                title: "留言失敗",
                message: "請再試一次",
            });
        },
    });

    /*
    useEffect(() => {
        if (session) cmtQueryRefetch({ refetchPage: () => true });
    }, [onSide, sortMethod, session]);


    if (cmtQueryError)
        return (
            <div className="mx-auto flex h-48 w-full rounded-xl bg-red-200 py-3">
                <div className="m-auto">
                    <h1 className="text-center text-3xl font-medium text-red-500">錯誤</h1>
                    <p className="my-2 px-6 text-center text-xl text-red-500">{`${cmtQueryError}`}</p>
                </div>
            </div>
        );

        */

    return (
        <div className="bg-neutral-50">
            <div className="mx-auto mb-4 flex flex-col px-9 pb-6 lg:py-3 ">
                {data && (
                    <>
                        <NewComment
                            addComment={(content: string, stance: Stances) => {
                                addThreadMutation.mutate({
                                    threadGroupId: threadGroupId,
                                    content: content,
                                    stance: stance,
                                });
                            }}
                        />
                        <div className="flex w-full flex-col gap-2 divide-y divide-neutral-300 pt-4">
                            {userComments
                                .concat(
                                    data.pages
                                        .flat()
                                        .flatMap(
                                            (element) =>
                                                element.retData as ThreadData[]
                                        )
                                )
                                .map((data, i, arr) => {
                                    return (
                                        <ThreadDisplay
                                            key={i}
                                            threadGroupId={threadGroupId}
                                            data={data}
                                            deleteComment={(cmtId) => {
                                                // delComment.mutate(cmtId);
                                            }}
                                            ref={
                                                i === arr.length - 1
                                                    ? lastCardRef
                                                    : undefined
                                            }
                                        />
                                    );
                                })}
                        </div>
                    </>
                )}
                {userComments.length === 0 &&
                    data?.pages.length === 0 &&
                    !(isLoading || isFetching) && <NoCommentsDisplay />}
                {(isLoading || isFetching) &&
                    !lastCardInView &&
                    data?.pages.length == 0 && <LoadingSkeleton />}
            </div>
        </div>
    );
};

export default CommentField;
