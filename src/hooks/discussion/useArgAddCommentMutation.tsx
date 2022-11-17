import { showNotification } from "@mantine/notifications";
import { ArgumentThread, Comment } from "../../types/comments.types";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { showErrorNotification } from "../../lib/errorHandling";

interface useArgAddCommentMutationProps {
    closeCommentInput: () => void;
    selectedThread: number | null;
}

const useArgAddCommentMutation = ({
    closeCommentInput,
    selectedThread,
}: useArgAddCommentMutationProps) => {
    const trpcUtils = trpc.useContext();

    const addCommentMutation = trpc.useMutation("comments.createComment", {
        onSettled: () => {
            trpcUtils.invalidateQueries(["comments.getArgumentComments"]);
            closeCommentInput();
        },
        onSuccess: (data, variables) => {
            trpcUtils.setInfiniteQueryData(
                [
                    "comments.getArgumentComments",
                    {
                        argumentId: variables.argument,
                        sort: "",
                        stance: "both",
                        limit: 20,
                        threadId: selectedThread,
                    },
                ],
                (prev) => {
                    if (!prev) {
                        return {
                            pages: [{ retData: [data], nextCursor: undefined }],
                            pageParams: [],
                        };
                    }
                    return {
                        ...prev,
                        pages: prev.pages.map((page) => ({
                            ...page,
                            retData: [...page.retData, data],
                        })),
                    };
                }
            );
        },
        onError: () => {
            showErrorNotification({
                message: "留言失敗，請再試一次",
            });
        },
    });

    return addCommentMutation;
};

export default useArgAddCommentMutation;
