import { useState, useEffect, useRef, forwardRef } from "react";

import { ArrowCircleUpIcon, ReplyIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

import styles from "../../../../styles/CommentCard.module.css";

// import ReportInterface from '../common/ReportInterface';
import ExtendedMenu from "./ExtendedMenu";
import { LikeIcon, DislikeIcon } from "./CommentReactionButtons";
import { ReplyTextField } from "./ReplyAccessroies";

import ReportModal from "../../../Report/ReportModal";

import { Comment } from "../../../../types/commentTypes";

interface CommentCardProps {
    data: Comment;
    motherComment?: number;
    addReply?: (content: string) => void;
    deleteFunction: (commentId: number, motherComment?: number) => void;
}

const CommentCard = forwardRef<HTMLDivElement, CommentCardProps>(
    ({ data, motherComment, addReply, deleteFunction }, ref) => {
        // const { data: session } = useSession();

        const [supported, setSupported] = useState<boolean>(data.userSupported);
        const [liked, setLiked] = useState<boolean>(data.userLiked);
        const [disliked, setDisliked] = useState<boolean>(data.userDisliked);

        const [showReportMenu, setShowReportMenu] = useState<boolean>(false);
        const [reportModalKey, setReportModalKey] = useState<number>(0);
        const [enableAnim, setEnableAnim] = useState<boolean>(false);

        const [showReplyBox, setShowReplyBox] = useState<boolean>(false);

        // const boardData = useRecoilValue(boardDataState);

        const firstRender = useRef(true);

        // const reactionsMutation = useMutation((updatedStats) =>
        //     updateCommentReactions({
        //         auth: `Token ${session.authToken}`,
        //         boardId: boardData.boardId,
        //         motherComment,
        //         commentId: data.id,
        //         updatedStats,
        //     })
        // );

        useEffect(() => {
            // if (!firstRender.current)
            // reactionsMutation.mutate({
            //     supported: supported,
            //     liked: liked,
            //     disliked: disliked,
            // });
        }, [supported, liked, disliked]);

        useEffect(() => {
            firstRender.current = false;
        }, []);

        const updateUserStatus = (
            updatevar: "liked" | "supported" | "disliked"
        ) => {
            if (!enableAnim) setEnableAnim(true);
            if (updatevar === "supported") {
                setSupported(!supported);
                if (!supported) {
                    setLiked(false);
                    setDisliked(false);
                }
            } else if (updatevar === "liked") {
                setLiked(!liked);
                if (!liked) {
                    setSupported(false);
                    setDisliked(false);
                }
            } else if (updatevar === "disliked") {
                setDisliked(!disliked);
                if (!disliked) {
                    setSupported(false);
                    setLiked(false);
                }
            }
        };

        return (
            <>
                <div className="flex w-full gap-3" ref={ref}>
                    <img
                        className={`h-7 w-7 flex-shrink-0 border-2 p-1 ${
                            !motherComment
                                ? data.stance === "sup"
                                    ? "border-green-300"
                                    : "border-red-400"
                                : "border-neutral-300"
                        } overflow-hidden rounded-full`}
                        src={data.author.profileImg}
                        alt="Profile"
                    />
                    <div className="flex-grow">
                        <h3 className="text-base text-primary-800">
                            {data.author.username}
                        </h3>
                        <p className="mt-2 mb-3 text-base text-neutral-700">
                            {data.message}
                        </p>

                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex h-6">
                                <div className="flex h-6 w-40 flex-shrink-0 items-center gap-3">
                                    <div className="flex items-center">
                                        <button
                                            onClick={(e) => {
                                                updateUserStatus("liked");
                                            }}
                                        >
                                            <LikeIcon
                                                status={liked}
                                                enableAnim={enableAnim}
                                                styles={styles}
                                            />
                                        </button>
                                        <p className="inline text-sm text-neutral-500">
                                            {data.likes + (liked ? 1 : 0)}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            className="mr-1 overflow-hidden"
                                            onClick={() => {
                                                updateUserStatus("supported");
                                            }}
                                        >
                                            <ArrowCircleUpIcon
                                                className={`inline w-7 overflow-hidden ${
                                                    supported
                                                        ? "border-primary-600 fill-primary-600 stroke-neutral-50"
                                                        : "text-neutral-500"
                                                } ${
                                                    supported &&
                                                    enableAnim &&
                                                    styles.animateFlyUp
                                                }`}
                                            />
                                        </button>
                                        <p className="inline text-sm text-neutral-500">
                                            {data.support + (supported ? 1 : 0)}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => {
                                                updateUserStatus("disliked");
                                            }}
                                        >
                                            <DislikeIcon
                                                status={disliked}
                                                enableAnim={enableAnim}
                                                styles={styles}
                                            />
                                            <p className="inline text-sm text-neutral-500">
                                                {data.dislikes +
                                                    (disliked ? 1 : 0)}
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {!motherComment && (
                                    <button
                                        className="my-auto ml-4 hidden text-neutral-500 2xl:block"
                                        onClick={() => {
                                            setShowReplyBox(!showReplyBox);
                                        }}
                                    >
                                        {showReplyBox ? (
                                            <XIcon className="inline h-6 w-6" />
                                        ) : (
                                            <ReplyIcon className="inline h-6 w-6" />
                                        )}
                                    </button>
                                )}
                            </div>

                            <div>
                                <ExtendedMenu
                                    cmtData={data}
                                    setShowReportMenu={setShowReportMenu}
                                    deleteFunction={deleteFunction}
                                    allowReply={!motherComment}
                                    setShowReplyBox={setShowReplyBox}
                                    showReplyBox={showReplyBox}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {showReplyBox && (
                    <ReplyTextField
                        addReply={addReply}
                        setShowReplyBox={setShowReplyBox}
                    />
                )}

                <ReportModal
                    key={reportModalKey}
                    open={showReportMenu}
                    closeFunction={() => {
                        setShowReportMenu(false);
                        setTimeout(() => {
                            setReportModalKey(reportModalKey + 1);
                        }, 500);
                    }}
                    title="請問您認為此留言有什麼問題？"
                    options={[
                        { key: "irrelevant", text: "內容與討論無關" },
                        { key: "spam", text: "廣告或洗版訊息" },
                        { key: "hatred", text: "散播仇恨言論或人生攻擊" },
                        { key: "sexual", text: "含有煽情露骨內容" },
                        { key: "terrorism", text: "散播恐怖主義" },
                    ]}
                    allowOther
                    maxReasons={3}
                    submitFunction={async (
                        value: string[],
                        content?: string
                    ) => {
                        return new Promise(function (resolve, reject) {
                            setTimeout(() => {
                                resolve("success");
                            }, 200);
                        });
                    }}
                />
            </>
        );
    }
);

CommentCard.displayName = "CommentCard";

export default CommentCard;
