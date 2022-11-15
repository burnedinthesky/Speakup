import { ActionIcon, Textarea } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import type { ContentErrors } from "./ArticleEditor";
import type { ArticleBlockTypes } from "../../../../types/article.types";
import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";

const BlockTypeStyles = {
    h1: "text-2xl mt-4",
    h2: "text-xl mt-2",
    h3: "text-lg mt-1",
    p: "text-base",
    spoiler: "text-base",
};

interface ArticleContentProps {
    articleContent: string[];
    setArticleContent: (fn: (cur: string[]) => string[]) => void;
    focusSelection: (val: number) => void;
    blurSelection: () => void;
    blockStyles: ArticleBlockTypes[];
    setBlockStyles: (
        fn: (cur: ArticleBlockTypes[]) => ArticleBlockTypes[]
    ) => void;
    contentErrors: ContentErrors;
}

const ArticleContent = ({
    articleContent,
    setArticleContent,
    focusSelection,
    blurSelection,
    blockStyles,
    setBlockStyles,
    contentErrors,
}: ArticleContentProps) => {
    const [autoFocus, setAutoFocus] = useState<number | null>(null);

    const autoFocusRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!autoFocusRef.current) return;
            autoFocusRef.current.focus();
            setAutoFocus(null);
        }, 50);
        return () => {
            clearTimeout(timeout);
        };
    }, [autoFocus]);

    return (
        <div className="mt-4 flex w-full flex-col ">
            <h3 className="mb-2 text-2xl font-semibold">議題內文</h3>
            {contentErrors.content && (
                <p className="text-sm text-red-500">{contentErrors.content}</p>
            )}
            {articleContent.map((block, i) => {
                const createNewBlock = () => {
                    if (articleContent.some((block) => block.length === 0))
                        return;
                    setArticleContent((cur) => {
                        let newContent = cloneDeep(cur);
                        newContent.splice(i + 1, 0, "");
                        return newContent;
                    });
                    setBlockStyles((cur) => {
                        let newContent = cloneDeep(cur);
                        newContent.splice(i + 1, 0, "p");
                        return newContent;
                    });
                    setAutoFocus(i + 1);
                };

                const deleteBlock = () => {
                    setArticleContent((cur) => cur.filter((_, j) => j !== i));
                    setBlockStyles((cur) => cur.filter((_, j) => j !== i));
                };
                return (
                    <div
                        key={i}
                        className="group flex w-full items-center gap-2"
                    >
                        <Textarea
                            value={block}
                            ref={
                                autoFocus !== null && autoFocus === i
                                    ? autoFocusRef
                                    : undefined
                            }
                            onChange={(e) => {
                                let updateString = e.currentTarget.value;
                                if (
                                    updateString[updateString.length - 1] ==
                                    "\n"
                                ) {
                                    createNewBlock();
                                    return;
                                }
                                updateString = updateString.replaceAll(
                                    "\n",
                                    ""
                                );
                                setArticleContent((cur) =>
                                    cur.map((block, j) =>
                                        j === i ? updateString : block
                                    )
                                );
                            }}
                            autosize
                            className="flex-grow"
                            classNames={{
                                input: `${
                                    BlockTypeStyles[
                                        blockStyles[i] as ArticleBlockTypes
                                    ]
                                } w-full`,
                            }}
                            onFocus={() => {
                                focusSelection(i);
                            }}
                            onBlur={() => {
                                blurSelection();
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Backspace" &&
                                    block.length === 0
                                ) {
                                    deleteBlock();
                                }
                            }}
                            variant="unstyled"
                            placeholder="新增段落"
                        />
                        <div className="flex flex-col">
                            <ActionIcon
                                className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                onClick={() => {
                                    createNewBlock();
                                }}
                            >
                                <PlusIcon className="w-4 text-slate-500" />
                            </ActionIcon>
                            <ActionIcon
                                className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                onClick={() => {
                                    deleteBlock();
                                }}
                            >
                                <TrashIcon className="w-4 text-slate-500" />
                            </ActionIcon>
                        </div>
                    </div>
                );
            })}

            <button
                className={`flex h-8 w-full items-center text-slate-500 ${
                    articleContent.length === 0 ? "opacity-60" : "opacity-0"
                } transition-opacity disabled:invisible hover:opacity-60`}
                disabled={
                    articleContent.length >= 1 &&
                    articleContent[articleContent.length - 1]?.length === 0
                }
                onClick={() => {
                    setArticleContent((cur) => [...cur, ""]);
                    setBlockStyles((cur) => [...cur, "p"]);
                }}
            >
                <div className="flex-grow border-t border-t-slate-500"></div>
                <div className="mx-4 flex items-center gap-2 ">
                    <PlusIcon className="w-4" />
                    <p className="text-sm">新增段落</p>
                </div>
                <div className="flex-grow border-t border-t-slate-500"></div>
            </button>
        </div>
    );
};

export default ArticleContent;
