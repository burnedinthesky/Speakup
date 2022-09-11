import { useState } from "react";
import { useInView } from "react-intersection-observer";

import CommentGroup from "./CommentGroup";
import {
    NewComment,
    NoCommentsDisplay,
    LoadingSkeleton,
} from "./CommentAccessories";
import { Comment, Stances } from "../../../schema/comments.schema";
import { trpc } from "../../../utils/trpc";

import { cmtQueryData } from "../../../templateData/comments";

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
    const [userComments, setUserComments] = useState<Comment[]>([]);
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

    /*
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
                                            boardId={"1"}
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
                    !(isLoading || isFetching) && <NoCommentsDisplay />}
                {(isLoading || isFetching) && <LoadingSkeleton />}
            </div>
        </div>
    );
};

export default CommentField;
