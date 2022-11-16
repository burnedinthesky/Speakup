import { useState } from "react";
import { trpc } from "../../../utils/trpc";

import { LoadingOverlay, Modal } from "@mantine/core";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import CommentCard from "./CommentCard";

import { ToModComments } from "../../../types/advocate/comments.types";

interface ArticleCommentsProps {
    articleId: string;
    articleTitle: string;
}

const ArticleComments = ({ articleId, articleTitle }: ArticleCommentsProps) => {
    const [excluded, setExcluded] = useState<number[]>([]);
    const [expandComment, setExpandedComment] = useState<number | null>(null);
    const [modalKey, setModalKey] = useState<number>(0);

    const { data: queryData, isLoading } = trpc.useInfiniteQuery(
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
                  comment ? !excluded.includes(comment.id) : false
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
                                key={comment.id}
                                data={comment}
                                removeCard={() => {
                                    setExcluded((cur) => [...cur, comment.id]);
                                }}
                                expandComment={() => {
                                    setExpandedComment(comment.id);
                                }}
                            />
                        ))}
                </div>
            </div>
            <Modal
                key={modalKey}
                opened={expandComment !== null}
                onClose={() => {
                    setExpandedComment(null);
                    setModalKey((cur) => cur + 1);
                }}
                withCloseButton={false}
                centered
                size="auto"
                overlayOpacity={0.2}
            >
                <div className="relative h-20 w-[90vw]  max-w-2xl">
                    <LoadingOverlay
                        visible={true}
                        loaderProps={{ color: "gray" }}
                    />
                </div>
            </Modal>
        </>
    );
};

export default ArticleComments;
