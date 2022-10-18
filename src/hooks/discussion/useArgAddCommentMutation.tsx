import { showNotification } from "@mantine/notifications";
import { ArgumentThread, Comment } from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";
import { trpc } from "../../utils/trpc";

interface useArgAddCommentMutationProps {
    threads: ArgumentThread[];
    selectedThread: number | null;
}

const useArgAddCommentMutation = ({
    threads,
    selectedThread,
}: useArgAddCommentMutationProps) => {
    const trpcUtils = trpc.useContext();

    interface ContextType {
        thread: number | null;
        minId: number;
    }

    const addCommentMutation = trpc.useMutation("comments.createComment", {
        onSuccess: (data, variables, context) => {
            const ctx = context as ContextType;

            const minId = ctx.minId;

            trpcUtils.setInfiniteQueryData(
                [
                    "comments.getArgumentComments",
                    {
                        argumentId: variables.argument,
                        sort: "",
                        stance: "both",
                        limit: 20,
                        threadId: ctx.thread,
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
                        pages: prev.pages.map((page) => {
                            return {
                                ...page,
                                retData: page.retData.map((element) =>
                                    element.id === minId ? data : element
                                ),
                            };
                        }),
                    };
                }
            );

            trpcUtils.invalidateQueries(["comments.getArgumentComments"]);
        },
        onError: (_, variables, context) => {
            const ctx = context as ContextType;

            const minId = ctx.minId;

            trpcUtils.setInfiniteQueryData(
                [
                    "comments.getArgumentComments",
                    {
                        limit: 20,
                        argumentId: variables.argument,
                        sort: "",
                        stance: "both",
                        threadId: ctx.thread,
                    },
                ],
                (prev) => {
                    if (!prev) {
                        return {
                            pages: [],
                            pageParams: [],
                        };
                    }
                    return {
                        ...prev,
                        pages: prev.pages.map((page) => {
                            return {
                                ...page,
                                retData: page.retData.filter(
                                    (element) => element.id !== minId
                                ),
                            };
                        }),
                    };
                }
            );

            showNotification({
                title: "發生未知錯誤",
                message: "留言失敗，請再試一次",
                color: "red",
            });

            trpcUtils.invalidateQueries(["comments.getArgumentComments"]);
        },
        onMutate: (newComment) => {
            let minId = -1;
            const formattedNewCmt = {
                id: -1,
                author: {
                    ...SampleUser,
                },
                content: newComment.content,
                isAuthor: false,
                likes: 0,
                support: 0,
                dislikes: 0,
                stance: newComment.stance,
                userLiked: false,
                userSupported: false,
                userDisliked: false,
                thread: newComment.thread
                    ? threads.find((element) => element.id == newComment.thread)
                    : undefined,
            } as Comment;

            trpcUtils.cancelQuery(["comments.getArgumentComments"]);
            trpcUtils.setInfiniteQueryData(
                [
                    "comments.getArgumentComments",
                    {
                        limit: 20,
                        argumentId: newComment.argument,
                        sort: "",
                        stance: "both",
                        threadId: selectedThread,
                    },
                ],
                (prev) => {
                    prev?.pages.forEach((page) => {
                        page.retData.forEach((element) => {
                            if (element.id < minId) minId = element.id;
                        });
                    });

                    formattedNewCmt.id = minId;

                    if (!prev) {
                        return {
                            pages: [
                                {
                                    retData: [formattedNewCmt],
                                    nextCursor: undefined,
                                },
                            ],
                            pageParams: [],
                        };
                    }

                    return {
                        ...prev,
                        pages: prev.pages.map((element, i, arr) => {
                            if (i < arr.length - 1) return element;
                            return {
                                ...element,
                                retData: [...element.retData, formattedNewCmt],
                            };
                        }),
                    };
                }
            );

            return {
                thread: selectedThread,
                minId,
            } as ContextType;
        },
    });

    return addCommentMutation;
};

export default useArgAddCommentMutation;
