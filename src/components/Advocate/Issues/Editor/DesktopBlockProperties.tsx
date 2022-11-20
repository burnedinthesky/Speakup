import { Select } from "@mantine/core";
import { ArticleBlockTypes } from "../../../../types/article.types";

interface BlockPropertiesProps {
    blockStyles: ArticleBlockTypes[];
    setBlockStyles: (
        fn: (cur: ArticleBlockTypes[]) => ArticleBlockTypes[]
    ) => void;
    focusedBlock: number;
    setOverrideBlur: (val: number | null) => void;
    setQueuedBlur: (val: boolean) => void;
}

const DesktopBlockProperties = ({
    blockStyles,
    setBlockStyles,
    focusedBlock,
    setOverrideBlur,
    setQueuedBlur,
}: BlockPropertiesProps) => {
    return (
        <div className="mt-28 w-full">
            <Select
                label="段落型態"
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
    );
};

export default DesktopBlockProperties;
