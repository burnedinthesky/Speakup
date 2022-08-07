import React from "react";
import { ReplyIcon } from "@heroicons/react/outline";
import CommentCard from "./CommentCard/CommentCard";
import { Comment } from "../../../types/commentTypes";

interface CommentResponseFieldProps {
    commentId: number;
    commentData: Comment[];
    deleteReply: (commentId: number, motherComment?: number) => void;
}

const CommentResponseField = ({
    commentId,
    commentData,
    deleteReply,
}: CommentResponseFieldProps) => {
    return (
        <div className="mt-2 ml-auto flex w-[88%] flex-col md:w-11/12 lg:w-[88%] xl:w-11/12">
            {commentData.map((cmt, i) => {
                if (!cmt.id) return <div key={`${commentId}${i}`} />;
                return (
                    <CommentCard
                        key={`${commentId}${i}`}
                        data={cmt}
                        motherComment={commentId}
                        deleteFunction={deleteReply}
                    />
                );
            })}
        </div>
    );
};

export default CommentResponseField;
