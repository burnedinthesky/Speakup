import { useState } from "react";
import BaseCommentInput from "./BaseOpInput";
import { ArgumentThread, Stances } from "../../../../schema/comments.schema";
import ThreadsMenu from "../Threads/ThreadsMenu";

interface CommentInputProps {
    threads: ArgumentThread[];
    addComment: (
        cmtContent: string,
        stance: Stances,
        thread: number | null
    ) => void;
    setShowReplyBox: (value: boolean) => void;
    setOpenNewThreadModal?: (value: boolean) => void;
}

const CommentInput = ({
    threads,
    addComment,
    setShowReplyBox,
    setOpenNewThreadModal,
}: CommentInputProps) => {
    const [selectedThread, setSelectedThread] = useState<number | null>(null);

    const submitComment = (cmtContent: string, cmtStance: Stances) => {
        addComment(cmtContent, cmtStance, selectedThread);
    };

    return (
        <div className="ml-10 mb-2 flex w-11/12 items-center pt-1">
            <BaseCommentInput
                addComment={submitComment}
                setCommentEnterStatus={setShowReplyBox}
                shrinkAtStart={false}
                additionalSelector={
                    <ThreadsMenu
                        threads={threads}
                        selectedThread={selectedThread}
                        setSelectedThread={setSelectedThread}
                        setOpenNewThreadModal={setOpenNewThreadModal}
                    />
                }
            />
        </div>
    );
};

export default CommentInput;
