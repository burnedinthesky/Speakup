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
        if (
            commentDiv.current?.innerText == undefined ||
            commentDiv.current?.innerText == ""
        ) {
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
                className={`transition-width relative mt-2 mb-4 flex flex-grow-0 items-center border border-primary-800 px-3 duration-300 ${
                    enteringComment
                        ? "w-full rounded-2xl"
                        : "h-9 w-9 rounded-full"
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
                                if (
                                    commentDiv.current?.innerText !== "" &&
                                    !choosingSide
                                ) {
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
                            className={`h-6 w-6 flex-shrink-0 text-primary-800 ${
                                choosingSide ? "hidden" : "block"
                            } `}
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 fill-primary-800"
                        >
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
        <div className="mx-auto mb-2 flex w-11/12 flex-col items-center">
            <svg
                className="h-32"
                viewBox="-40 30 200 137"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="60"
                    cy="107"
                    r="57.5"
                    fill="#F2FBFC"
                    stroke="#D8E8EA"
                    stroke-width="5"
                />
                <rect x="60" width="107" height="107" fill="#F2FBFC" />
                <path
                    d="M107.346 45.1085C103.531 45.1085 99.6455 46.5715 96.7335 49.4835L64.25 81.9705L45.1085 89.296L43.25 90.0625L42.921 92.033L38 124.951L37.342 129.651L42.0495 129L74.974 124.079L76.941 123.75L77.7075 121.892L84.599 103.734L86.349 102.096L117.849 70.5955C123.495 64.9465 123.603 55.8815 118.287 50.0295L117.849 49.4835C116.475 48.0966 114.839 46.9959 113.037 46.2449C111.235 45.494 109.301 45.1077 107.349 45.1085H107.346ZM107.346 52C109.313 52 111.283 52.875 112.921 54.5165C116.204 57.796 116.204 62.3915 112.921 65.671L95.3125 83.2795L84.1545 72.125L101.767 54.5165C103.405 52.875 105.375 52 107.342 52H107.346ZM79.125 77.158L90.283 88.3125L83.9375 94.658L72.7795 83.5L79.125 77.158ZM67.421 88.204H67.5295L78.7995 99.467L71.9045 117.517L51.454 120.467L60.8585 111.063C61.051 111.077 61.2155 111.171 61.4045 111.171C64.495 111.171 67.0955 108.686 67.0955 105.596C67.0955 102.505 64.495 99.908 61.4045 99.908C58.3175 99.908 55.829 102.505 55.829 105.596C55.829 105.785 55.9235 105.949 55.9375 106.142L46.5295 115.546L49.4835 95.0955L67.421 88.204Z"
                    fill="#D8E8EA"
                />
            </svg>
            <p className="mt-4 text-center text-neutral-200">
                目前還沒有人發表評論
                <br />
                快來分享你的看法吧~
            </p>
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
