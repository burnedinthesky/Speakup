import { useCallback, useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { conforms, debounce } from "lodash";

import { ArrowCircleUpIcon } from "@heroicons/react/outline";

import { Argument, Comment } from "../../../../schema/comments.schema";

import styles from "../../../../styles/CommentCard.module.css";

interface InteractionIconProps {
    status: boolean;
    enableAnim: boolean;
    styles: any;
}
export function LikeIcon({ status, enableAnim, styles }: InteractionIconProps) {
    return (
        <svg
            className={`mr-1 inline h-7 w-7 p-[3.5px] text-neutral-500 ${
                status && enableAnim && styles.animateJumpUp
            } ${status ? "filter-green ease-in" : "filter-none"}`}
            xmlns="http://www.w3.org/2000/svg"
            width="25.149"
            height="25.501"
            viewBox="0 0 25.149 25.501"
        >
            <path
                className={`${
                    status
                        ? "fill-primary-600 stroke-primary-600"
                        : "fill-transparent stroke-neutral-500"
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M16.5,10.875v-4.5A3.375,3.375,0,0,0,13.125,3l-4.5,10.125V25.5h12.69a2.25,2.25,0,0,0,2.25-1.913l1.553-10.125a2.25,2.25,0,0,0-2.25-2.588ZM8.625,25.5H5.25A2.25,2.25,0,0,1,3,23.251V15.375a2.25,2.25,0,0,1,2.25-2.25H8.625"
                transform="translate(-1.5 -1.5)"
            />
        </svg>
    );
}
export function DislikeIcon({
    status,
    enableAnim,
    styles,
}: InteractionIconProps) {
    return (
        <svg
            className={`mr-1 inline h-7 w-7 p-[3.5px] text-neutral-500 ${
                status && enableAnim && styles.animateJumpDown
            } ${status ? "filter-red ease-in" : "filter-none"}`}
            xmlns="http://www.w3.org/2000/svg"
            width="22.934"
            height="23.251"
            viewBox="0 0 22.934 23.251"
        >
            <path
                className={`${
                    status
                        ? "fill-primary-600 stroke-primary-600"
                        : "fill-transparent stroke-neutral-500"
                }`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M11.255,16.162v4.05a3.037,3.037,0,0,0,3.037,3.037l4.05-9.112V3H6.921A2.025,2.025,0,0,0,4.9,4.721L3.5,13.834a2.025,2.025,0,0,0,2.025,2.329ZM18.342,3h2.7A2.339,2.339,0,0,1,23.4,5.025v7.087a2.339,2.339,0,0,1-2.359,2.025h-2.7"
                transform="translate(-1.971 -1.499)"
            />
        </svg>
    );
}

interface CommentReactionButtions {
    data: Comment | Argument;
    cardType: "argument" | "comment";
    enableAnim: boolean;
    setEnableAnim: (value: boolean) => void;
    interaction: "liked" | "supported" | "disliked" | null;
    setInteraction: (value: "liked" | "supported" | "disliked" | null) => void;
}

export function CommentReactionButtons({
    data,
    cardType,
    enableAnim,
    setEnableAnim,
    interaction,
    setInteraction,
}: CommentReactionButtions) {
    const [previousState, setPreviousState] = useState<
        "liked" | "supported" | "disliked" | null
    >(null);

    const submitArgumentInteraction = trpc.useMutation(
        "arguments.updateArgumentInteraction",
        {
            onError: () => {
                setInteraction(previousState);
            },
        }
    );

    const submitCommentsInteraction = trpc.useMutation(
        "comments.updateCommentsInteraction",
        {
            onError: () => {
                setInteraction(previousState);
            },
        }
    );

    const submitInteractionFn = (
        updatedStatus: "liked" | "supported" | "disliked" | null
    ) => {
        if (cardType == "argument") {
            submitArgumentInteraction.mutate({
                id: data.id,
                status: updatedStatus,
            });
        } else
            submitCommentsInteraction.mutate({
                id: data.id,
                status: updatedStatus,
            });
    };

    const submitInteractionDB = useCallback(
        debounce(submitInteractionFn, 200),
        []
    );

    const updateUserStatus = (
        updatevar: "liked" | "supported" | "disliked"
    ) => {
        if (!enableAnim) setEnableAnim(true);
        const updatedVal = interaction == updatevar ? null : updatevar;
        setPreviousState(interaction);
        console.log(updatedVal);
        submitInteractionDB(updatedVal);
        setInteraction(updatedVal);
    };

    return (
        <div className="flex h-6 w-40 flex-shrink-0 items-center gap-3">
            <div className="flex items-center">
                <button
                    onClick={() => {
                        updateUserStatus("liked");
                    }}
                >
                    <LikeIcon
                        status={interaction == "liked"}
                        enableAnim={enableAnim}
                        styles={styles}
                    />
                </button>
                <p className="inline text-sm text-neutral-500">
                    {data.likes + (interaction == "liked" ? 1 : 0)}
                </p>
            </div>

            <div className="flex items-center">
                <button
                    className="mr-1 overflow-hidden"
                    onClick={() => {
                        console.log("yo");
                        updateUserStatus("supported");
                    }}
                >
                    <ArrowCircleUpIcon
                        className={`inline w-7 overflow-hidden ${
                            interaction == "supported"
                                ? "border-primary-600 fill-primary-600 stroke-neutral-50"
                                : "text-neutral-500"
                        } ${
                            interaction == "supported" &&
                            enableAnim &&
                            styles.animateFlyUp
                        }`}
                    />
                </button>
                <p className="inline text-sm text-neutral-500">
                    {data.support + (interaction == "supported" ? 1 : 0)}
                </p>
            </div>

            <div className="flex items-center">
                <button
                    onClick={() => {
                        updateUserStatus("disliked");
                    }}
                >
                    <DislikeIcon
                        status={interaction == "disliked"}
                        enableAnim={enableAnim}
                        styles={styles}
                    />
                    <p className="inline text-sm text-neutral-500">
                        {data.dislikes + (interaction == "disliked" ? 1 : 0)}
                    </p>
                </button>
            </div>
        </div>
    );
}
