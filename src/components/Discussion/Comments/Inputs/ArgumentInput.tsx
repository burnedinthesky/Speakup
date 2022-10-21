import { useState } from "react";

import BaseCommentInput from "./BaseOpInput";

import { Stances } from "../../../../types/comments.types";

interface ArgumentInputProps {
    addComment: (cmtContent: string, cmtSide: Stances) => void;
}

const ArgumentInput = ({ addComment }: ArgumentInputProps) => {
    const [isCommenting, setIsCommenting] = useState<boolean>(false);

    return (
        <div className="mt-2 mb-4 flex w-full flex-col items-end justify-center">
            {isCommenting ? (
                <BaseCommentInput
                    addComment={addComment}
                    setCommentEnterStatus={setIsCommenting}
                    shrinkAtStart={true}
                />
            ) : (
                <button
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary-800 `}
                    onClick={() => {
                        setIsCommenting(true);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 fill-primary-800 pl-[1px]"
                    >
                        <path d="M4 14a1 1 0 0 1 .3-.7l11-11a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-11 11a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-3z" />
                        <rect width="20" height="2" x="2" y="20" rx="1" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ArgumentInput;
