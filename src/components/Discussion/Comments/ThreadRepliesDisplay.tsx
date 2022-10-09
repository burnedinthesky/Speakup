import { useState } from "react";
import ThreadDisplay from "./ThreadDisplay";
import { Comment, ThreadData } from "../../../schema/comments.schema";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

interface ThreadRepliesDisplayProps {
    data: Comment[];
}

const ThreadRepliesDisplay = ({ data }: ThreadRepliesDisplayProps) => {
    const [excludedIDs, setExcludedIDs] = useState<number[]>([]);

    const deleteCommentMutation = trpc.useMutation("comments.deleteComment", {
        onSuccess: (data, variables) => {
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
            {data.map((comment, i) => {
                if (comment.leadsThread) {
                    return (
                        <ThreadDisplay
                            data={thread}
                            deleteComment={(id) => {
                                deleteCommentMutation.mutate({
                                    id: id,
                                });
                            }}
                        />
                    );
                }
            })}
        </div>
    );
};

export default ThreadRepliesDisplay;
