import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { ActionIcon, Select } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { cloneDeep } from "lodash";
import { ArticleBlockTypes } from "../../../../types/article.types";

interface BlockPropertiesProps {
    blockStyles: ArticleBlockTypes[];
    setBlockStyles: (
        fn: (cur: ArticleBlockTypes[]) => ArticleBlockTypes[]
    ) => void;
    focusedBlock: number | null;
    setOverrideBlur: (val: number | null) => void;
    setQueuedBlur: (val: boolean) => void;
    articleContent: string[];
    setArticleContent: (fn: (cur: string[]) => string[]) => void;
}

const MobileBlockProperties = ({
    blockStyles,
    setBlockStyles,
    focusedBlock,
    setOverrideBlur,
    setQueuedBlur,
    articleContent,
    setArticleContent,
}: BlockPropertiesProps) => {
    const createNewBlock = () => {
        if (!focusedBlock) return;
        console.log("What");
        if (articleContent.some((block) => block.length === 0)) return;
        setArticleContent((cur) => {
            let newContent = cloneDeep(cur);
            newContent.splice(focusedBlock + 1, 0, "");
            return newContent;
        });
        setBlockStyles((cur) => {
            let newContent = cloneDeep(cur);
            newContent.splice(focusedBlock + 1, 0, "p");
            return newContent;
        });
    };

    const deleteBlock = () => {
        setArticleContent((cur) => cur.filter((_, j) => j !== focusedBlock));
        setBlockStyles((cur) => cur.filter((_, j) => j !== focusedBlock));
    };

    return (
        <div
            className={`fixed left-[calc(50vw-160px)] bottom-10 z-10 h-10 w-80 rounded-full border border-slate-300 bg-white px-3 shadow-lg transition-all lg:hidden ${
                focusedBlock === null ? "-bottom-32" : "bottom-10"
            }`}
        >
            {focusedBlock !== null && (
                <div className="flex h-full w-full items-center gap-2">
                    <ActionIcon
                        onClick={() => {
                            createNewBlock();
                        }}
                    >
                        <PlusIcon className="w-4 text-slate-500" />
                    </ActionIcon>
                    <ActionIcon
                        onClick={() => {
                            deleteBlock();
                        }}
                    >
                        <TrashIcon className="w-4 text-slate-500" />
                    </ActionIcon>
                    <Select
                        classNames={{
                            input: "border-0",
                        }}
                        data={[
                            { value: "h1", label: "大標" },
                            { value: "h2", label: "中標" },
                            { value: "h3", label: "小標" },
                            { value: "p", label: "段落" },
                        ]}
                        value={blockStyles[focusedBlock]}
                        onChange={(val: string) => {
                            const updateVal = val as ArticleBlockTypes;
                            setBlockStyles((current) =>
                                current.map((block, i) =>
                                    i === focusedBlock ? updateVal : block
                                )
                            );
                        }}
                        onFocus={() => {
                            setOverrideBlur(focusedBlock);
                        }}
                        onBlur={() => {
                            setQueuedBlur(true);
                        }}
                        size="sm"
                    />
                </div>
            )}
        </div>
    );
};
export default MobileBlockProperties;
