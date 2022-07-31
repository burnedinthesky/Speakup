import React, { useState, useRef } from "react";
import { PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import { Stances } from "../../../types/commentTypes";

interface NewCommentProps {
    addComment: (cmtContent: string, cmtSide: Stances) => void;
}

const NewComment = ({ addComment }: NewCommentProps) => {
    const commentDiv = useRef<HTMLInputElement>(null);
    const [enteringComment, setEnteringComment] = useState(false);
    const [choosingSide, setChoosingSide] = useState(false);
    const [commentSide, setCommentSide] = useState(null);
    const [contentEditable, setContentEditable] = useState(true);

    const postComment = async (cmtSide: Stances) => {
        if (commentDiv.current?.innerText == undefined || commentDiv.current?.innerText == "") {
            throw new Error("Comment is undefined or empty");
        }
        addComment(commentDiv?.current?.innerText, cmtSide);
        setEnteringComment(false);
        setChoosingSide(false);
        setCommentSide(null);
    };

    return (
        <div className="flex w-full items-center justify-end">
            <div
                className={`relative mt-2 mb-4 flex flex-grow-0 items-center border border-primary-800 px-3 transition-width ${
                    enteringComment ? "w-full rounded-2xl" : "h-9 w-9 rounded-full"
                } `}
            >
                {enteringComment && (
                    <div
                        ref={commentDiv}
                        className={`my-auto h-full w-full bg-transparent pl-2 pr-32 text-lg leading-9 text-neutral-800 focus:outline-none`}
                        contentEditable={contentEditable}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (commentDiv.current?.innerText !== "" && !choosingSide) {
                                    setContentEditable(false);
                                    setChoosingSide(true);
                                }
                            }
                        }}
                    />
                )}
                {enteringComment ? (
                    <div className="absolute top-1.5 right-2 flex h-7 flex-wrap items-center justify-end gap-2 overflow-hidden">
                        <button
                            className={`h-6 w-6 flex-shrink-0 text-primary-800 disabled:text-primary-500 ${
                                choosingSide ? "hidden" : "block"
                            }`}
                            onClick={async () => {
                                if (commentDiv.current?.innerText !== "") {
                                    setChoosingSide(true);
                                    setContentEditable(false);
                                }
                            }}
                        >
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                        <button
                            className={`h-6 w-6 flex-shrink-0 text-primary-800 ${choosingSide ? "hidden" : "block"} `}
                            onClick={() => {
                                setEnteringComment(!enteringComment);
                            }}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                        <button
                            className={`border-primary-800 ${
                                commentSide === "sup"
                                    ? " bg-primary-800 text-primary-50"
                                    : "bg-neutral-100  text-primary-800"
                            } ${
                                choosingSide ? "block" : "hidden"
                            } h-6 w-6 flex-shrink-0 rounded-full border text-center text-sm `}
                            onClick={() => {
                                postComment("sup");
                            }}
                        >
                            支
                        </button>
                        <button
                            className={`border-primary-800 ${
                                commentSide === "agn"
                                    ? " bg-primary-800 text-primary-50"
                                    : "bg-neutral-100  text-primary-800"
                            } ${
                                choosingSide ? "block" : "hidden"
                            } h-6 w-6 flex-shrink-0 rounded-full border text-center text-sm `}
                            onClick={() => {
                                postComment("agn");
                            }}
                        >
                            反
                        </button>
                        <button
                            className={`border-primary-800 ${
                                commentSide === "non"
                                    ? " bg-primary-800 text-primary-50"
                                    : "bg-neutral-100  text-primary-800"
                            } ${
                                choosingSide ? "block" : "hidden"
                            } h-6 w-6 flex-shrink-0 rounded-full border text-center text-sm `}
                            onClick={() => {
                                postComment("neu");
                            }}
                        >
                            無
                        </button>
                    </div>
                ) : (
                    <button
                        className={`absolute top-1.5 right-1 m-auto h-6 w-6 flex-shrink-0 `}
                        onClick={() => {
                            setEnteringComment(true);
                            setContentEditable(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-primary-800">
                            <path d="M4 14a1 1 0 0 1 .3-.7l11-11a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1 0 1.4l-11 11a1 1 0 0 1-.7.3H5a1 1 0 0 1-1-1v-3z" />
                            <rect width="20" height="2" x="2" y="20" rx="1" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

const NoCommentsDisplay = () => {
    return (
        <div className=" mx-auto my-2 flex h-40 w-11/12">
            <div className="m-auto">
                <h1 className="text-center text-xl">
                    目前還沒有留言呢 <br />
                    成為第一個留言的人吧
                </h1>
            </div>
        </div>
    );
};

const LoadingSkeleton = () => {
    return (
        <div className="flex w-full gap-3 py-2">
            <img className="h-7 w-7 flex-shrink-0 animate-pulse rounded-full border-2 border-gray-300 bg-gray-300 p-1" />
            <div className="flex-grow">
                <div className="mb-2 h-5 w-36 animate-pulse rounded-lg bg-gray-300"></div>
                <div className="my-1 h-5 animate-pulse rounded-lg bg-gray-300"></div>
                <div className="mt-1 mb-3 h-5 animate-pulse rounded-lg bg-gray-300"></div>
                <div className="my-1 h-5 w-32 animate-pulse rounded-lg bg-gray-300"></div>
            </div>
        </div>
    );
};

export { NewComment, NoCommentsDisplay, LoadingSkeleton };
