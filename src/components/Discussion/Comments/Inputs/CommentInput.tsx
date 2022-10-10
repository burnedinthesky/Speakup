import BaseCommentInput from "./BaseOpInput";
import { Stances } from "../../../../schema/comments.schema";

interface CommentInputProps {
    addReply: (cmtContent: string, stance: Stances) => void;
    setShowReplyBox: (value: boolean) => void;
}

const CommentInput = ({ addReply, setShowReplyBox }: CommentInputProps) => {
    return (
        <div className="ml-10 mb-2 flex w-11/12 items-center overflow-x-hidden pt-1">
            <BaseCommentInput
                addComment={addReply}
                setCommentEnterStatus={setShowReplyBox}
            />
        </div>
    );
};

export default CommentInput;
