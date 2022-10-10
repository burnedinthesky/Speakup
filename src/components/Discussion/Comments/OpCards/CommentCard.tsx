import { useState, useEffect, useRef, forwardRef } from "react";

import { CommentReactionButtons } from "../OpCardComponents/CommentReactionButtons";
import ExtendedMenu from "../OpCardComponents/ExtendedMenu";
import ReportModal from "../../../Report/ReportModal";

import { Comment, Stances } from "../../../../schema/comments.schema";

interface CommentCardProps {
    data: Comment;
    deleteFunction: (commentId: number, motherComment?: number) => void;
}

const CommentCard = forwardRef<HTMLDivElement, CommentCardProps>(
    ({ data, deleteFunction }, ref) => {
        const [interaction, setInteraction] = useState<
            "liked" | "supported" | "disliked" | null
        >(
            data.userLiked
                ? "liked"
                : data.userSupported
                ? "supported"
                : data.userDisliked
                ? "disliked"
                : null
        );

        const [showReportMenu, setShowReportMenu] = useState<boolean>(false);
        const [reportModalKey, setReportModalKey] = useState<number>(0);
        const [enableAnim, setEnableAnim] = useState<boolean>(false);

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
        }, [interaction]);

        useEffect(() => {
            firstRender.current = false;
        }, []);

        return (
            <>
                <div className="flex w-full gap-3" ref={ref}>
                    <img
                        className={`h-7 w-7 flex-shrink-0 border-2 p-1 ${
                            data.stance === "sup"
                                ? "border-green-300"
                                : data.stance === "agn"
                                ? "border-red-400"
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
                            {data.content}
                        </p>

                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex h-6">
                                <CommentReactionButtons
                                    data={data}
                                    cardType="comment"
                                    enableAnim={enableAnim}
                                    setEnableAnim={setEnableAnim}
                                    interaction={interaction}
                                    setInteraction={setInteraction}
                                />
                            </div>
                            <div>
                                <ExtendedMenu
                                    dataId={data.id}
                                    isAuthor={data.isAuthor}
                                    setShowReportMenu={setShowReportMenu}
                                    deleteFunction={deleteFunction}
                                    allowReply={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

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