import { LoadingOverlay, Modal } from "@mantine/core";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import DeleteReasonDropdown from "./DeleteReasonDropdown";

interface ExpandedCommentModalProps {
    expandComment: {
        argId: number;
        cmtId: number;
    } | null;
    setExpandedComment: (
        val: {
            argId: number;
            cmtId: number;
        } | null
    ) => void;
}

const ExpandedCommentModal = ({
    expandComment,
    setExpandedComment,
}: ExpandedCommentModalProps) => {
    const [modalKey, setModalKey] = useState<number>(0);

    const { data, isLoading } = trpc.advocate.comments.fetchCommentThread.useQuery({
                    argId: expandComment ? expandComment.argId : null,
                    commentId: expandComment ? expandComment.cmtId : null,
                });

    return (
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
            overflow="inside"
        >
            <div className="relative w-[80vw] max-w-3xl">
                <LoadingOverlay
                    visible={isLoading}
                    loaderProps={{ color: "gray" }}
                />
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                    <div className="lg:w-1/2">
                        <h3 className="text-sm font-bold">論點＆回覆</h3>
                        {data && (
                            <div className="mt-2 w-full lg:h-80 lg:overflow-y-auto">
                                <p className="my-2">{data.argument.content}</p>
                                <div className="ml-4 flex flex-col gap-3 text-slate-600">
                                    {data.comments.map((comment, i) => (
                                        <p
                                            key={i}
                                            className={`${
                                                comment.id ===
                                                expandComment?.cmtId
                                                    ? " text-neutral-500"
                                                    : ""
                                            } `}
                                        >
                                            {comment.content}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <hr className="border-b border-b-slate-400 lg:hidden" />
                    <div className="flex-col justify-between lg:flex lg:w-1/2">
                        {expandComment && (
                            <DeleteReasonDropdown
                                id={expandComment.cmtId}
                                type="comment"
                                deleteComment={() => {}}
                                cancelDelete={() => {
                                    setExpandedComment(null);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ExpandedCommentModal;
