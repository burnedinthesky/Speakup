import { ExternalLinkIcon } from "@heroicons/react/outline";
import { LoadingOverlay, Modal } from "@mantine/core";
import { useState } from "react";
import { SampleToModComments } from "../../../templateData/advocate/comments";
import { ToModComments } from "../../../types/advocate/comments.types";
import CommentCard from "./CommentCard";

interface ArticleCommentsProps {
    articleId: string;
    articleTitle: string;
}

const ArticleComments = ({ articleId, articleTitle }: ArticleCommentsProps) => {
    const data: ToModComments[] = SampleToModComments;

    const [excluded, setExcluded] = useState<number[]>([]);
    const [expandComment, setExpandedComment] = useState<number | null>(null);
    const [modalKey, setModalKey] = useState<number>(0);

    return (
        <>
            <div className="w-full">
                <a
                    href={`/discussion/${articleId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-slate-700"
                >
                    <h2 className="text-2xl font-medium ">{articleTitle}</h2>
                    <ExternalLinkIcon className="ml-2 w-6" />
                </a>
                <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-2">
                    {data
                        .filter((comment) => !excluded.includes(comment.id))
                        .map((comment) => (
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
