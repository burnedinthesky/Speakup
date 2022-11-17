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

    const { data, isLoading } = trpc.useQuery([
        "advocate.comments.fetchCommentThread",
        {
            argId: expandComment ? expandComment.argId : null,
            commentId: expandComment ? expandComment.cmtId : null,
        },
    ]);

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
        >
            <div className="relative w-[90vw] max-w-3xl">
                <LoadingOverlay
                    visible={isLoading}
                    loaderProps={{ color: "gray" }}
                />
                <div className="flex w-full gap-4">
                    <div className="w-1/2">
                        <h3 className="text-sm font-bold">論點＆回覆</h3>
                        {data && (
                            <div className="mt-2 h-80 w-full overflow-y-auto">
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
                    <div className="flex w-1/2 flex-col justify-between">
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
