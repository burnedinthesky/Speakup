import { useState } from "react";
import BaseCommentInput from "./BaseOpInput";
import { ArgumentThread, Stances } from "../../../../types/comments.types";
import ThreadsMenu from "../Threads/ThreadsMenu";

interface CommentInputProps {
    threads: ArgumentThread[];
    addComment: (
        cmtContent: string,
        stance: Stances,
        thread: number | null
    ) => void;
    viewingSelectedThread: number | null;
    setShowReplyBox: (value: boolean) => void;
    setOpenNewThreadModal?: (value: boolean) => void;
}

const CommentInput = ({
    threads,
    addComment,
    viewingSelectedThread,
    setShowReplyBox,
    setOpenNewThreadModal,
}: CommentInputProps) => {
    const [selectedThread, setSelectedThread] = useState<number | null>(null);

    const submitComment = (cmtContent: string, cmtStance: Stances) => {
        addComment(
            cmtContent,
            cmtStance,
            viewingSelectedThread ? viewingSelectedThread : selectedThread
        );
    };

    return (
        <div className="ml-10 mb-2 flex w-11/12 items-center pt-1">
            <BaseCommentInput
                addComment={submitComment}
                setCommentEnterStatus={setShowReplyBox}
                shrinkAtStart={false}
                additionalSelector={
                    viewingSelectedThread ? (
                        <ThreadsMenu
                            threads={threads.filter(
                                (ele) => ele.id === viewingSelectedThread
                            )}
                            selectedThread={viewingSelectedThread}
                            setSelectedThread={() => {}}
                        />
                    ) : (
                        <ThreadsMenu
                            threads={threads}
                            selectedThread={selectedThread}
                            setSelectedThread={setSelectedThread}
                            setOpenNewThreadModal={setOpenNewThreadModal}
                        />
                    )
                }
            />
        </div>
    );
};

export default CommentInput;
