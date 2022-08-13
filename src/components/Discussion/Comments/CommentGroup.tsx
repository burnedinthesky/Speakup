import React, { useState, useEffect, forwardRef } from "react";
import { useInfiniteQuery, useMutation } from "react-query";
// import { useSession } from "next-auth/react";
import { cloneDeep } from "lodash";

import { Comment } from "../../../types/commentTypes";
// import { deleteReply, getCommentReplies, postCommentReply } from "../../lib/commentFuncs";

import { ReplyIcon } from "@heroicons/react/solid";

import CommentCard from "./CommentCard/CommentCard";
import CommentResponseField from "./CommentResponseField";
import { ShowRepliesButton } from "./CommentCard/ReplyAccessroies";

interface CommandGroupProps {
    boardId: string;
    comment: Comment;
    deleteComment: (commentId: number, motherComment?: number) => void;
}

const CommentGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
    ({ boardId, comment, deleteComment }, ref) => {
        const [userReplies, setUserReplies] = useState<Comment[]>([]);
        // const { data: session } = useSession();

        // const {
        //     data: replyQueryData,
        //     error: replyQueryError,
        //     isLoading: replyQueryLoading,
        //     fetchNextPage: replyQueryFetchNextPage,
        //     hasNextPage: replyQueryHasNextPage,
        //     isFetching: replyQueryFetching,
        //     refetch: replyQueryRefetch,
        // } = useInfiniteQuery(
        //     `reply-${cmtdata.id}`,
        //     ({ pageParam = 0 }) => {
        //         return getCommentReplies({
        //             auth: `Token ${session.authToken}`,
        //             boardId,
        //             commentId: cmtdata.id,
        //             onpage: pageParam,
        //         });
        //     },
        //     {
        //         getNextPageParam: (lastPage, pages) => (Math.ceil(lastPage[0].totalComments / 10) > pages.length ? pages.length : undefined),
        //         enabled: false,
        //     }
        // );

        // const addReplyMutation = useMutation(
        //     (newReply) => {
        //         return postCommentReply({
        //             auth: `Token ${session.authToken}`,
        //             boardId,
        //             commentid: cmtdata.id,
        //             cmtcontent: newReply,
        //         });
        //     },
        //     {
        //         onSuccess: (data) => {
        //             setUserReplies(userReplies.concat(data));
        //         },
        //     }
        // );

        // const deleteReplyMutation = useMutation(
        //     (replyId) =>
        //         deleteReply({
        //             auth: `Token ${session.authToken}`,
        //             boardId,
        //             commentId: cmtdata.id,
        //             replyId,
        //         }),
        //     {
        //         onSuccess: (data, variables) => {
        //             let replyId = variables;
        //             let newReplies;
        //             if (userReplies.some((element) => element.id === replyId)) {
        //                 newReplies = cloneDeep(userReplies);
        //                 setUserReplies(newReplies.filter((element) => element.id !== replyId));
        //             } else {
        //                 replyQueryRefetch({
        //                     refetchPage: (page, index) => page.some((cmt) => cmt.id === replyId),
        //                 });
        //             }
        //         },
        //     }
        // );

        // useEffect(() => {
        //     if (replyQueryData) {
        //         let newUserCmts = cloneDeep(userReplies);
        //         replyQueryData.pages[replyQueryData.pages.length - 1].forEach((item) => {
        //             newUserCmts = newUserCmts.filter((cmt) => cmt.id !== item.id);
        //         });
        //         setUserReplies(newUserCmts);
        //     }
        // }, [replyQueryData]);

        // const FetchRepliesBtn = () => {
        //     if ((!replyQueryHasNextPage && replyQueryData) || !cmtdata.cmtReplies) return <div></div>;

        //     return (
        //         <button
        //             className="flex items-start gap-1 text-neutral-500"
        //             onClick={() => {
        //                 replyQueryFetchNextPage();
        //             }}
        //             disabled={replyQueryLoading || replyQueryFetching}
        //         >
        //             <ReplyIcon className="inline h-5 w-5 rotate-180" />
        //             <p className="inline text-sm">{replyQueryLoading || replyQueryFetching ? "載入中" : "查看回覆"}</p>
        //         </button>
        //     );
        // };

        const replyQueryData: Comment[] = [];

        return (
            <div className="w-full" ref={ref}>
                <CommentCard
                    data={comment}
                    addReply={(content) => {
                        // addReplyMutation.mutate(content);
                    }}
                    deleteFunction={deleteComment}
                />
                <div className="mt-2">
                    <CommentResponseField
                        commentId={comment.id}
                        commentData={replyQueryData.concat(userReplies)}
                        deleteReply={(replyId) => {
                            // deleteReplyMutation.mutate(replyId);
                        }}
                    />
                    <div className="pl-10">
                        <ShowRepliesButton fetchReplies={() => {}} />
                    </div>
                </div>
            </div>
        );
    }
);

CommentGroup.displayName = "CommentGroup";

export default CommentGroup;
