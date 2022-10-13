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

    const addCommentMutation = trpc.useMutation("comments.createComment", {
        onSuccess: (data, variables, context) => {
            const ctx = context as {
                query: "argument" | "thread";
                previousData: any[];
                minId: number;
            };

            const minId = ctx.minId;

            if (ctx.query == "argument") {
                trpcUtils.setInfiniteQueryData(
                    [
                        "comments.getArgumentComments",
                        {
                            argumentId: variables.argument,
                            sort: "",
                            stance: "both",
                            limit: 20,
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
                                    retData: page.retData.map((element) =>
                                        element.id === minId ? data : element
                                    ),
                                };
                            }),
                        };
                    }
                );
                trpcUtils.invalidateQueries(["comments.getArgumentComments"]);
            } else {
                trpcUtils.setQueryData(
                    ["comments.getThreadComments"],
                    (prev) => {
                        if (!prev) return [];
                        return prev.map((element) =>
                            element.id === minId ? data : element
                        );
                    }
                );
                trpcUtils.invalidateQueries(["comments.getThreadComments"]);
            }
        },
        onError: (_, variables, context) => {
            const ctx = context as {
                query: "argument" | "thread";
                minId: number;
                threadId: number | number;
            };

            const minId = ctx.minId;

            if (ctx.query == "argument") {
                trpcUtils.setInfiniteQueryData(
                    [
                        "comments.getArgumentComments",
                        {
                            limit: 20,
                            argumentId: variables.argument,
                            sort: "",
                            stance: "both",
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
                trpcUtils.invalidateQueries(["comments.getArgumentComments"]);
            } else {
                trpcUtils.setQueryData(
                    [
                        "comments.getThreadComments",
                        {
                            argumentId: variables.argument,
                            threadId: variables.thread,
                        },
                    ],
                    (prev) => {
                        if (!prev) return [];
                        return prev.filter((element) => element.id !== minId);
                    }
                );
                trpcUtils.invalidateQueries(["comments.getThreadComments"]);
            }

            showNotification({
                title: "發生未知錯誤",
                message: "留言失敗，請再試一次",
                color: "red",
            });
        },
        onMutate: (newComment) => {
            const query = selectedThread === null ? "argument" : "thread";
            let previousData,
                minId = -1;
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

            if (selectedThread === null) {
                trpcUtils.cancelQuery(["comments.getArgumentComments"]);
                previousData = trpcUtils.getInfiniteQueryData([
                    "comments.getArgumentComments",
                ]);
                trpcUtils.setInfiniteQueryData(
                    [
                        "comments.getArgumentComments",
                        {
                            limit: 20,
                            argumentId: newComment.argument,
                            sort: "",
                            stance: "both",
                        },
                    ],
                    (prev) => {
                        if (!prev) {
                            return {
                                pages: [],
                                pageParams: [],
                            };
                        }
                        console.log("yoo");
                        const returning = {
                            ...prev,
                            pages: prev.pages.map((element, i, arr) => {
                                if (i < arr.length - 1) return element;
                                element.retData.forEach((element) => {
                                    if (element.id < minId) minId = element.id;
                                });
                                formattedNewCmt.id = minId;
                                return {
                                    ...element,
                                    retData: [
                                        ...element.retData,
                                        formattedNewCmt,
                                    ],
                                };
                            }),
                        };

                        console.log(returning);

                        return returning;
                    }
                );
            } else {
                trpcUtils.cancelQuery(["comments.getThreadComments"]);
                previousData = trpcUtils.getQueryData([
                    "comments.getThreadComments",
                ]);
                if (previousData)
                    previousData.forEach((element) => {
                        if (element.id < minId) minId = element.id;
                    });
                formattedNewCmt.id = minId;
                trpcUtils.setQueryData(
                    [
                        "comments.getThreadComments",
                        {
                            argumentId: newComment.argument,
                            threadId: selectedThread,
                        },
                    ],
                    (prev) => {
                        if (!prev) {
                            return [];
                        }
                        return [...prev, formattedNewCmt];
                    }
                );
            }
            return {
                query,
                minId,
            };
        },
    });

    return addCommentMutation;
};

export default useArgAddCommentMutation;
