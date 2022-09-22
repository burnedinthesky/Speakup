import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";

import ThreadDisplay from "./ThreadDisplay";
import { NoCommentsDisplay, LoadingSkeleton } from "./CommentAccessories";
import { Stances, ThreadData } from "../../../schema/comments.schema";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { XIcon } from "@heroicons/react/outline";
import { NewThreadInput } from "./CommentInput";

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
    const [excludedThreads, setExcludedThreads] = useState<number[]>([]);
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
            "threadgroups.wFirstComment",
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

    const addThreadMutation = trpc.useMutation("threads.createThread", {
        onSuccess: (data) => {
            setUserComments(userComments.concat(data));
        },
        onError: (error, variables) => {
            console.log(error);
            showNotification({
                title: "留言失敗",
                message: "請再試一次",
                color: "red",
                icon: <XIcon className="w-6 text-white" />,
            });
        },
    });

    const deleteCommentMutation = trpc.useMutation("comments.deleteComment", {
        onSuccess: (data, variables) => {
            setExcludedThreads(excludedThreads.concat([variables.id]));
        },
        onError: () => {
            showNotification({
                title: "發生未知錯誤",
                message: "留言刪除失敗，請再試一次",
            });
        },
    });

    if (error)
        return (
            <div className="mx-auto flex h-48 w-full rounded-xl bg-red-200 py-3">
                <div className="m-auto">
                    <h1 className="text-center text-3xl font-medium text-red-500">
                        錯誤
                    </h1>
                    <p className="my-2 px-6 text-center text-xl text-red-500">{`${error}`}</p>
                </div>
            </div>
        );

    return (
        <div className="bg-neutral-50">
            <div className="mx-auto mb-4 flex flex-col px-5 pb-6 sm:px-9 lg:py-3 ">
                {data && (
                    <>
                        <NewThreadInput
                            addComment={(content: string, stance: Stances) => {
                                addThreadMutation.mutate({
                                    threadGroupId: threadGroupId,
                                    content: content,
                                    stance: stance,
                                });
                            }}
                        />
                        <div className="flex w-full flex-col gap-3 pt-4">
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
                                    if (excludedThreads.includes(data.id))
                                        return;
                                    return (
                                        <Fragment key={i}>
                                            <ThreadDisplay
                                                threadGroupId={threadGroupId}
                                                data={data}
                                                deleteComment={() => {
                                                    refetch();
                                                    deleteCommentMutation.mutate(
                                                        {
                                                            id: data.leadComment
                                                                .id,
                                                        }
                                                    );
                                                }}
                                                ref={
                                                    i === arr.length - 1
                                                        ? lastCardRef
                                                        : undefined
                                                }
                                            />
                                            {i < arr.length - 1 && (
                                                <hr className="mt-2 border-b-[0.5px] border-neutral-200" />
                                            )}
                                        </Fragment>
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
                    data?.pages.length == undefined && <LoadingSkeleton />}
            </div>
        </div>
    );
};

export default CommentField;
