import { XIcon } from "@heroicons/react/outline";
import { showNotification } from "@mantine/notifications";
import { Argument, ArgumentThread } from "../../schema/comments.schema";
import { SampleUser } from "../../templateData/users";
import { trpc } from "../../utils/trpc";

interface useAddArgumentMutationProps {
    viewingStance: "sup" | "agn" | "both";
}

const useAddArgumentMutation = ({
    viewingStance,
}: useAddArgumentMutationProps) => {
    const trpcUtils = trpc.useContext();

    interface ContextType {
        minId: number;
    }
    const addArgumentMutation = trpc.useMutation("arguments.createArgument", {
        onSettled: (data) => {
            trpcUtils.invalidateQueries(["arguments.getArticleArguments"]);
        },
        onError: (_, variables, context) => {
            const ctx = context as ContextType;

            trpcUtils.setInfiniteQueryData(
                [
                    "arguments.getArticleArguments",
                    {
                        articleId: variables.articleId,
                        limit: 20,
                        sort: "",
                        stance: viewingStance,
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
                                    (element) => element.id !== ctx.minId
                                ),
                            };
                        }),
                    };
                }
            );

            showNotification({
                title: "留言失敗",
                message: "請再試一次",
                color: "red",
                icon: <XIcon className="w-6 text-white" />,
            });
        },
        onMutate: (variables) => {
            let minId = -1;
            const formattedNewArg = {
                id: -1,
                author: {
                    ...SampleUser,
                },
                content: variables.content,
                isAuthor: false,
                likes: 0,
                support: 0,
                dislikes: 0,
                stance: variables.stance,
                userLiked: false,
                userSupported: false,
                userDisliked: false,
                threads: [],
                hasComments: false,
            } as Argument;
            trpcUtils.cancelQuery(["arguments.getArticleArguments"]);

            trpcUtils.setInfiniteQueryData(
                [
                    "arguments.getArticleArguments",
                    {
                        articleId: variables.articleId,
                        limit: 20,
                        sort: "",
                        stance: viewingStance,
                    },
                ],
                (prev) => {
                    if (!prev) {
                        return {
                            pages: [],
                            pageParams: [],
                        };
                    }

                    prev.pages.forEach((page) => {
                        page.retData.forEach((element) => {
                            if (element.id < minId) minId = element.id;
                        });
                    });

                    return {
                        ...prev,
                        pages: prev.pages.map((element, i) => {
                            if (i > 0) return element;
                            formattedNewArg.id = minId;
                            return {
                                ...element,
                                retData: [formattedNewArg, ...element.retData],
                            };
                        }),
                    };
                }
            );

            return {
                minId,
            };
        },
    });

    return addArgumentMutation;
};

export default useAddArgumentMutation;
