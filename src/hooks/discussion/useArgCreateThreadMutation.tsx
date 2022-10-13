import { showNotification } from "@mantine/notifications";
import { ArgumentThread } from "../../schema/comments.schema";
import { trpc } from "../../utils/trpc";

interface useArgCreateThreadMutationProps {
    setAddedThreads: (
        setValueFunc: (prevState: ArgumentThread[]) => ArgumentThread[]
    ) => void;
    selectedThread: number | null;
}

const useArgCreateThreadMutation = ({
    setAddedThreads,
    selectedThread,
}: useArgCreateThreadMutationProps) => {
    const trpcUtils = trpc.useContext();

    const createThreadMutation = trpc.useMutation("arguments.createNewThread", {
        onSuccess: (data, variables, context) => {
            const ctx = context as {
                query: "argument" | "threads";
            };

            setAddedThreads((cur) =>
                cur.map((element) => (element.id == -1 ? data : element))
            );

            if (ctx.query == "argument") {
                trpcUtils.setInfiniteQueryData(
                    [
                        "comments.getArgumentComments",
                        {
                            argumentId: variables.argumentId,
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
                                        variables.updatingComments.includes(
                                            element.id
                                        )
                                            ? {
                                                  ...element,
                                                  thread: data,
                                              }
                                            : element
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
                            variables.updatingComments.includes(element.id)
                                ? {
                                      ...element,
                                      thread: data,
                                  }
                                : element
                        );
                    }
                );
                trpcUtils.invalidateQueries(["comments.getThreadComments"]);
            }
        },
        onError: () => {
            setAddedThreads((cur) =>
                cur.filter((element) => element.id !== -1)
            );
            showNotification({
                title: "發生未知錯誤",
                message: "討論串建立失敗，請再試一次",
                color: "red",
            });
        },
        onMutate: (data) => {
            setAddedThreads((cur) =>
                cur.concat([
                    {
                        id: -1,
                        argumentId: data.argumentId,
                        name: data.name,
                    },
                ])
            );
            return {
                query: selectedThread === null ? "argument" : "thread",
            };
        },
    });

    return createThreadMutation;
};

export default useArgCreateThreadMutation;
