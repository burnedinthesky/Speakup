import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

import CommentCard from "./OpDisplays/CommentCard";

import { Comment } from "../../../schema/comments.schema";

interface ArgumentCommentProps {
    data: Comment[];
}

const ArgumentComments = ({ data }: ArgumentCommentProps) => {
    const [excludedIDs, setExcludedIDs] = useState<number[]>([]);

    const deleteCommentMutation = trpc.useMutation("comments.deleteComment", {
        onSuccess: (_, variables) => {
            setExcludedIDs(excludedIDs.concat([variables.id]));
        },
        onError: () => {
            showNotification({
                title: "發生未知錯誤",
                message: "留言刪除失敗，請再試一次",
            });
        },
    });

    return (
        <div className="mt-2 ml-auto flex w-[88%] flex-col md:w-11/12 lg:w-[88%] xl:w-11/12">
            {data.map((comment, i) => (
                <CommentCard
                    key={i}
                    data={comment}
                    deleteFunction={() => {
                        deleteCommentMutation.mutate({ id: comment.id });
                    }}
                />
            ))}
        </div>
    );
};

export default ArgumentComments;
