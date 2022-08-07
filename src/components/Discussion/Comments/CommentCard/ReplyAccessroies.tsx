import { useState, useRef } from "react";
import { ReplyIcon } from "@heroicons/react/outline";

interface ReplyTextField {
    addReply?: (content: string) => void;
    setShowReplyBox: (value: boolean) => void;
}

export function ReplyTextField({ addReply, setShowReplyBox }: ReplyTextField) {
    const replyFieldRef = useRef<HTMLInputElement>(null);

    const postReply = () => {
        if (replyFieldRef.current && addReply) {
            addReply(replyFieldRef.current.innerText);
            replyFieldRef.current.innerText = "";
        }
        setShowReplyBox(false);
    };

    return (
        <div className="ml-10 mb-2 flex w-11/12 items-center overflow-x-hidden pt-1">
            <div
                className={`w-full flex-grow-0 rounded-3xl border-2 border-neutral-400 py-1.5 pl-5 pr-10 text-sm`}
                contentEditable={true}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        postReply();
                    }
                }}
                ref={replyFieldRef}
            />
            <button
                className={`relative right-8 -bottom-1 pb-2`}
                onClick={postReply}
            >
                <ReplyIcon className="h-5 w-5 text-primary-800" />
            </button>
        </div>
    );
}

export function ShowRepliesButton({
    fetchReplies,
}: {
    fetchReplies: () => void;
}) {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <button
            className="flex items-start gap-1 text-neutral-500"
            onClick={() => {
                setIsClicked(true);
                fetchReplies();
            }}
            disabled={isClicked}
        >
            <ReplyIcon className="inline h-5 w-5 rotate-180" />
            <p className="inline text-sm">
                {isClicked ? "載入中" : "查看回覆"}
            </p>
        </button>
    );
}
