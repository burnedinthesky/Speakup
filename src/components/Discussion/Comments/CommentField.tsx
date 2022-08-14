import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useMutation } from "react-query";
// import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";

import { cloneDeep } from "lodash";

import CommentGroup from "./CommentGroup";
import {
    NewComment,
    NoCommentsDisplay,
    LoadingSkeleton,
} from "./CommentAccessories";
import { Comment, Stances } from "../../../types/commentTypes";

interface CommentFieldProps {
    boardId: string;
    onSide: "sup" | "agn" | "both";
    sortMethod: "default" | "time" | "replies";
}

const CommentField = ({ boardId, onSide, sortMethod }: CommentFieldProps) => {
    // const { data: session } = useSession();
    const [userComments, setUserComments] = useState<Comment[]>([]);
    const { ref: lastCardRef, inView: lastCardInView, entry } = useInView();

    /*const {
        data: cmtQueryData,
        error: cmtQueryError,
        isLoading: cmtQueryLoading,
        fetchNextPage: cmtQueryFetchNextPage,
        hasNextPage: cmtQueryHasNextPage,
        isFetching: cmtQueryFetching,
        refetch: cmtQueryRefetch,
    } = useInfiniteQuery(
        "comments",
        ({ pageParam = 0 }) =>
            getBoardComments({
                auth: `Token ${session.authToken}`,
                boardId,
                onSide,
                fetchPage: pageParam,
                order: [(null, "time", "replies")][sortMethod - 1],
            }),
        {
            getNextPageParam: (lastPage, pages) =>
                Math.ceil(lastPage[0].totalComments / 20) > pages.length ? pages.length : undefined,
            enabled: false,
            refetchOnWindowFocus: false,
        }
    );

    const addComment = useMutation(
        (cmtParams) =>
            postComment({
                auth: `Token ${session.authToken}`,
                cmtContent: cmtParams.content,
                boardId,
                onSide: cmtParams.side,
            }),
        {
            onSuccess: (data) => {
                setUserComments([data, ...userComments]);
            },
            onError: (err) => {
                showNotification({
                    title: "發生未知的錯誤",
                    message: " 請再試一次",
                    color: "red",
                    autoClose: false,
                });
            },
        }
    );

    const delComment = useMutation(
        (commentId) =>
            deleteComment({
                auth: `Token ${session.authToken}`,
                boardId,
                commentid: commentId,
            }),
        {
            onSuccess: (data, variables) => {
                let commentId = variables.commentId;
                let newComments;
                if (userComments.some((element) => element.id === commentId)) {
                    newComments = cloneDeep(userComments);
                    setUserComments(newComments.filter((element) => element.id !== commentId));
                } else {
                    cmtQueryRefetch({
                        refetchPage: (page, index) => page.some((cmt) => cmt.id === commentId),
                    });
                }
            },
        }
    );

    useEffect(() => {
        if (session) cmtQueryRefetch({ refetchPage: () => true });
    }, [onSide, sortMethod, session]);

    useEffect(() => {
        if (entry !== undefined) {
            if (entry.isIntersecting && cmtQueryHasNextPage && !cmtQueryLoading) {
                cmtQueryFetchNextPage();
            }
        }
    }, [lastCardInView]);

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

    const cmtQueryData: Comment[] = [
        /*{
            id: 123,
            author: {
                id: "asjdkfl",
                username: "test",
                pfp: "http://www.google.com",
            },
            isOwner: false,
            message:
                "Esse adipisicing pariatur deserunt excepteur aute officia laboris deserunt. Ex commodo adipisicing deserunt aliqua qui aliqua dolor duis nostrud. Veniam ullamco exercitation Lorem qui aliqua esse pariatur laborum esse exercitation dolor esse quis et. Proident culpa nostrud esse aliquip. Est sint elit quis cillum commodo Lorem ex incididunt sint eiusmod dolore.",
            stance: "sup",
            replies: 0,
            likes: 1,
            userLiked: true,
            support: 0,
            userSupported: false,
            dislikes: 0,
            userDisliked: false,
        },*/
    ];

    return (
        <div className="bg-neutral-50">
            <div className="mx-auto mb-4 flex flex-col px-9 pb-6 lg:py-3 ">
                {true /*!cmtQueryLoading*/ && (
                    <>
                        <NewComment
                            addComment={(
                                cmtContent: string,
                                cmtSide: Stances
                            ) => {
                                // addComment.mutate({
                                //     content: commentContent,
                                //     side: side,
                                // });
                            }}
                        />
                        <div className="flex w-full flex-col gap-2 divide-y divide-neutral-300 pt-4">
                            {userComments
                                .concat(cmtQueryData)
                                .map((data, i, arr) => {
                                    // return data.totalComments !== undefined ? (
                                    //     <div key={i}></div>
                                    // ) : (
                                    return (
                                        <CommentGroup
                                            key={i}
                                            boardId={boardId}
                                            comment={data}
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
                                    // );
                                })}
                        </div>
                    </>
                )}
                {userComments.length === 0 &&
                    cmtQueryData.length === 0 &&
                    !false /*cmtQueryLoading*/ && <NoCommentsDisplay />}
                {/* {(cmtQueryLoading || cmtQueryFetching) && <LoadingSkeleton />} */}
            </div>
        </div>
    );
};

export default CommentField;
