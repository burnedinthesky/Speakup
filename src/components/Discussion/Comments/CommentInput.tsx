import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import { Stances } from "../../../schema/comments.schema";
import { showNotification } from "@mantine/notifications";

interface CommentInputProps {
    addComment: (cmtContent: string, cmtStance: Stances) => void;
    setCommentEnterStatus: (value: boolean) => void;
}

const CommentInput = ({
    addComment,
    setCommentEnterStatus,
}: CommentInputProps) => {
    const commentDiv = useRef<HTMLDivElement>(null);
    const [selectedStance, setSelectedStance] = useState<Stances | null>(null);
    const [expandWidth, setExpandWidth] = useState<boolean>(false);
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

    useEffect(() => {
        setExpandWidth(true);
    }, []);

    useEffect(() => {
        const checker = setInterval(() => {
            console.log(
                `TF ${
                    commentDiv.current?.innerText.trim() == "" ||
                    selectedStance == null
                }`
            );
            setDisableSubmit(
                commentDiv.current?.innerText.trim() == "" ||
                    selectedStance == null
            );
        }, 100);

        return () => {
            clearInterval(checker);
        };
    }, [selectedStance]);

    const postComment = async () => {
        if (
            commentDiv.current?.innerText == undefined ||
            commentDiv.current?.innerText == ""
        ) {
            showNotification({
                title: "留言失敗",
                message: "請輸入留言內容",
            });
            return;
        }
        if (selectedStance == null) {
            showNotification({
                title: "留言失敗",
                message: "請選擇留言立場",
            });
            return;
        }
        addComment(commentDiv?.current?.innerText, selectedStance);
        setCommentEnterStatus(false);
        setSelectedStance(null);
    };

    const StanceSelectButton = ({
        assignedStance,
        text,
    }: {
        assignedStance: Stances;
        text: string;
    }) => {
        return (
            <button
                className={`border-primary-800 ${
                    selectedStance === assignedStance
                        ? " bg-primary-800 text-primary-50"
                        : "bg-neutral-100  text-primary-800"
                } mx-1 inline h-6 w-6 flex-shrink-0 rounded-full border text-center text-sm 
                transition-transform ${
                    selectedStance == "agn"
                        ? "sm:-translate-x-[32px]"
                        : selectedStance == "neu"
                        ? "sm:-translate-x-[64px]"
                        : ""
                }
                `}
                onClick={() => {
                    setSelectedStance((lastStance) =>
                        lastStance ? null : assignedStance
                    );
                }}
            >
                {text}
            </button>
        );
    };

    const CloseButton = () => {
        return (
            <button
                className={`mx-1 h-6 w-6 flex-shrink-0 text-primary-800`}
                onClick={() => {
                    setCommentEnterStatus(false);
                }}
            >
                <XIcon className="h-6 w-6" />
            </button>
        );
    };

    const SubmitButton = () => {
        return (
            <button
                className={`h-6 ${
                    selectedStance ? "w-6 sm:mx-1" : "w-6 sm:w-0"
                } flex-shrink-0 overflow-hidden whitespace-nowrap text-primary-800 transition-width disabled:text-primary-500`}
                onClick={async () => {
                    if (commentDiv.current?.innerText !== "") {
                        postComment();
                    }
                }}
                disabled={disableSubmit}
            >
                <PaperAirplaneIcon className="h-6 w-6" />
            </button>
        );
    };

    return (
        <>
            <div
                className={`relative flex flex-grow-0 items-center rounded-2xl border border-primary-800 px-3 transition-width duration-300 ${
                    expandWidth ? "w-full" : "w-9"
                }`}
            >
                <div
                    ref={commentDiv}
                    className={`my-auto h-full w-full bg-transparent px-2 text-lg leading-9 text-neutral-800 focus:outline-none sm:pr-32`}
                    contentEditable
                    onKeyPress={(e) => {
                        setDisableSubmit(
                            commentDiv.current?.innerText.trim() == "" ||
                                selectedStance == null
                        );
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }}
                />
                <div className="absolute bottom-[3px] right-2 hidden h-7 flex-wrap items-center justify-end overflow-hidden sm:flex">
                    <div
                        className={`${
                            selectedStance ? "w-[32px]" : "w-[96px]"
                        } h-[25px] overflow-hidden whitespace-nowrap transition-width`}
                    >
                        <span>
                            <StanceSelectButton
                                assignedStance="sup"
                                text="支"
                            />
                            <StanceSelectButton
                                assignedStance="agn"
                                text="反"
                            />
                            <StanceSelectButton
                                assignedStance="neu"
                                text="中"
                            />
                        </span>
                    </div>
                    <SubmitButton />
                    <CloseButton />
                </div>
            </div>
            <div className="mt-2 flex h-7 w-full items-center justify-between sm:hidden">
                <span>
                    <StanceSelectButton assignedStance="sup" text="支" />
                    <StanceSelectButton assignedStance="agn" text="反" />
                    <StanceSelectButton assignedStance="neu" text="中" />
                </span>
                <span>
                    <SubmitButton />
                    <CloseButton />
                </span>
            </div>
            <hr className="mt-4 w-full border-b-[1px] border-b-primary-800 sm:hidden" />
        </>
    );
};

interface NewThreadInputProps {
    addComment: (cmtContent: string, cmtSide: Stances) => void;
}

const NewThreadInput = ({ addComment }: NewThreadInputProps) => {
    const [isCommenting, setIsCommenting] = useState<boolean>(false);

    return (
        <div className="mt-2 mb-4 flex w-full flex-col items-end justify-center">
            {isCommenting ? (
                <CommentInput
                    addComment={addComment}
                    setCommentEnterStatus={setIsCommenting}
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

export { CommentInput, NewThreadInput };
