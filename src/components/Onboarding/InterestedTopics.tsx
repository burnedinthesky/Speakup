import { useState } from "react";
import {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { Button, Chip } from "@mantine/core";
import { ArticleTagValues } from "../../types/article.types";

interface PageProps {
    prevPage?: () => void;
    nextPage?: () => void;
    setData: (topics: string[]) => void;
}

const InterestedTopics = ({ prevPage, nextPage, setData }: PageProps) => {
    const tags = ArticleTagValues;

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [error, setError] = useState("");

    const submitData = () => {
        let hasError = false;
        if (selectedTags.length < 3) {
            hasError = true;
            setError("請選擇至少三個標籤");
        }
        if (!hasError) {
            setData(selectedTags);
        }
        return !hasError;
    };

    return (
        <div className="relative h-full w-full pb-14">
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                <h1 className="text-5xl font-bold text-primary-700">
                    您感興趣的議題
                </h1>
                <p className="mt-14 text-2xl text-neutral-700">
                    請選擇三到五個您感興趣的標籤
                </p>

                <div className="mt-6 w-full">
                    {error.length > 0 && (
                        <p className="my-2 text-sm text-red-500">{error}</p>
                    )}
                    <div className="flex w-full gap-4">
                        <Chip.Group
                            value={selectedTags}
                            onChange={setSelectedTags}
                            multiple
                        >
                            {tags.map((tag, i) => (
                                <Chip
                                    key={i}
                                    value={tag}
                                    variant="filled"
                                    disabled={
                                        selectedTags.length >= 5 &&
                                        !selectedTags.includes(tag)
                                    }
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </Chip.Group>
                    </div>
                </div>
            </div>

            {prevPage && (
                <Button
                    className="absolute left-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={prevPage}
                >
                    上一頁
                    <ArrowNarrowLeftIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
            {nextPage && (
                <Button
                    className="absolute right-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={() => {
                        if (submitData()) nextPage();
                    }}
                >
                    繼續
                    <ArrowNarrowRightIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default InterestedTopics;
