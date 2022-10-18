import { useState, useEffect, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../../../utils/trpc";

import ArgumentDisplay from "./ArgumentDisplay";
import ArgumentInput from "./Inputs/ArgumentInput";
import NoCommentsDisplay from "./DisplayAccessories/NoCommentsDisplay";
import LoadingSkeleton from "./DisplayAccessories/LoadingSkeleton";

import { Argument, Stances } from "../../../schema/comments.schema";
import useAddArgumentMutation from "../../../hooks/discussion/useAddArgumentMutation";

interface CommentFieldProps {
    articleId: string;
    viewingStance: "sup" | "agn" | "both";
    sortMethod: "default" | "time" | "replies";
}

const CommentField = ({
    articleId,
    viewingStance,
    sortMethod,
}: CommentFieldProps) => {
    const [excludedArguments, setExcludedArguments] = useState<number[]>([]);
    const { ref: lastCardRef, inView: lastCardInView, entry } = useInView();

    const trpcUtils = trpc.useContext();

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
            "arguments.getArticleArguments",
            {
                articleId: articleId,
                stance: viewingStance,
                sort: sortMethod,
                limit: 20,
            },
        ],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    useEffect(() => {
        console.log("Whoa");
        console.log(sortMethod);
        trpcUtils.invalidateQueries(["arguments.getArticleArguments"]);
    }, [viewingStance, sortMethod]);

    useEffect(() => {
        if (entry !== undefined) {
            if (entry.isIntersecting && hasNextPage && !isLoading) {
                fetchNextPage();
            }
        }
    }, [lastCardInView]);

    const addArgumentMutation = useAddArgumentMutation({ viewingStance });

    const deleteArgumentMutation = trpc.useMutation(
        "arguments.deleteArgument",
        {
            onSettled: () => {
                trpcUtils.invalidateQueries(["arguments.getArticleArguments"]);
            },
            onError: (_, variables) => {
                setExcludedArguments(
                    excludedArguments.filter(
                        (element) => element !== variables.id
                    )
                );
                showNotification({
                    title: "發生未知錯誤",
                    message: "留言刪除失敗，請再試一次",
                });
            },
            onMutate: (variables) => {
                setExcludedArguments(excludedArguments.concat([variables.id]));
            },
        }
    );

    const hasComments =
        (data
            ? data.pages[0]?.retData.filter(
                  (element) => !excludedArguments.includes(element.id)
              ).length === 0
            : true) && !(isLoading || isFetching);

    if (error)
        return (
            <div className="mx-auto flex h-48 w-full rounded-xl bg-red-200 py-3">
                <div className="m-auto">
                    <h1 className="text-center text-3xl font-medium text-red-500">
                        錯誤
                    </h1>
                    <p className="my-2 px-6 text-center text-xl text-red-500">{`${error}`}</p>
                </div>
            </div>
        );

    return (
        <div className="bg-neutral-50">
            <div className="mx-auto mb-4 flex flex-col px-5 pb-6 sm:px-9 lg:py-3 ">
                {data && (
                    <>
                        <ArgumentInput
                            addComment={(content: string, stance: Stances) => {
                                addArgumentMutation.mutate({
                                    articleId: articleId,
                                    content: content,
                                    stance: stance,
                                });
                            }}
                        />
                        <div className="flex w-full flex-col gap-3 pt-4">
                            {data.pages
                                .flat()
                                .flatMap(
                                    (element) => element.retData as Argument[]
                                )
                                .map((data, i, arr) => {
                                    if (excludedArguments.includes(data.id))
                                        return;
                                    return (
                                        <Fragment key={i}>
                                            <ArgumentDisplay
                                                data={data}
                                                deleteArgument={() => {
                                                    refetch();
                                                    deleteArgumentMutation.mutate(
                                                        {
                                                            id: data.id,
                                                        }
                                                    );
                                                }}
                                                ref={
                                                    i === arr.length - 1
                                                        ? lastCardRef
                                                        : undefined
                                                }
                                            />
                                            {i < arr.length - 1 && (
                                                <hr className="mt-2 border-b-[0.5px] border-neutral-200" />
                                            )}
                                        </Fragment>
                                    );
                                })}
                        </div>
                    </>
                )}
                {hasComments && <NoCommentsDisplay />}
                {(isLoading || isFetching) && <LoadingSkeleton />}
            </div>
        </div>
    );
};

export default CommentField;
