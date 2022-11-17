import { useState } from "react";
import { trpc } from "../../../utils/trpc";

import { LoadingOverlay } from "@mantine/core";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import CommentCard from "./Cards/CommentCard";
import ExpandedCommentModal from "./ExpandedCommentModal";
import FetchMoreCard from "./Cards/FetchMoreCard";

import { ToModComments } from "../../../types/advocate/comments.types";
import CommentLoadingCard from "./Cards/CommentLoadingCard";

interface ArticleCommentsProps {
    articleId: string;
    articleTitle: string;
}

const ArticleComments = ({ articleId, articleTitle }: ArticleCommentsProps) => {
    const [excluded, setExcluded] = useState<string[]>([]);
    const [expandComment, setExpandedComment] = useState<{
        argId: number;
        cmtId: number;
    } | null>(null);

    const {
        data: queryData,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = trpc.useInfiniteQuery(
        ["advocate.comments.fetchArticleComments", { id: articleId }],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const data = queryData
        ? (queryData.pages
              .flatMap((page) => page.data.arguments)
              .concat(queryData.pages.flatMap((page) => page.data.comments))
              .filter((cmt) => typeof cmt !== "undefined")
              .filter((comment) =>
                  comment
                      ? !excluded.includes(comment.type + comment.id)
                      : false
              ) as ToModComments[])
        : undefined;

    return (
        <>
            <div
                className={` w-full transition-height duration-1000 ${
                    !isLoading && (!data || data?.length === 0)
                        ? "h-0 overflow-hidden"
                        : "h-auto"
                }`}
            >
                <a
                    href={`/discussion/${articleId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-700"
                >
                    <h2 className="text-2xl font-medium ">{articleTitle}</h2>
                    <ExternalLinkIcon className="ml-2 w-6" />
                </a>
                <div
                    className={`relative mt-4 grid grid-cols-4 gap-x-2 gap-y-2 ${
                        isLoading ? "h-40" : data ? "" : "h-0"
                    }`}
                >
                    <LoadingOverlay visible={isLoading} />
                    {data &&
                        data.map((comment) => (
                            <CommentCard
                                key={`${comment.type}${comment.id}`}
                                data={comment}
                                removeCard={() => {
                                    setExcluded((cur) => [
                                        ...cur,
                                        comment.type + comment.id,
                                    ]);
                                }}
                                expandComment={() => {
                                    if (
                                        comment.type === "comment" &&
                                        comment.argument
                                    )
                                        setExpandedComment({
                                            argId: comment.argument.id,
                                            cmtId: comment.id,
                                        });
                                }}
                            />
                        ))}
                    {isFetchingNextPage && <CommentLoadingCard />}
                    {hasNextPage && !isFetchingNextPage && (
                        <FetchMoreCard
                            fetchMore={() => {
                                fetchNextPage();
                            }}
                        />
                    )}
                </div>
            </div>
            <ExpandedCommentModal
                expandComment={expandComment}
                setExpandedComment={setExpandedComment}
            />
        </>
    );
};

export default ArticleComments;
