import { useState } from "react";
import { useRouter } from "next/router";

import { SearchIcon } from "@heroicons/react/outline";
import { TextInput } from "@mantine/core";
import { CheckCircleIcon } from "@heroicons/react/solid";

import { ArticleTagValues } from "../../types/article.types";
import { AppShell } from "../../components/AppShell";

const SearchMenu = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tags = ArticleTagValues;
    const router = useRouter();

    const submitSearch = () => {
        if (searchKeyword.length || selectedTags.length) {
            let params = new URLSearchParams();
            if (searchKeyword.length) params.set("keyword", searchKeyword);
            if (selectedTags.length)
                params.set("tags", selectedTags.toString());

            router.push(`/search/results?${params.toString()}`);
        }
    };

    return (
        <AppShell title="Speakup - 搜尋">
            <div className="lg:ml-64">
                <div className="mx-auto mt-14 max-w-3xl px-8 py-5 md:mt-[20vh] lg:rounded-2xl">
                    <div className="relative flex h-8 w-full items-center lg:h-14">
                        <TextInput
                            className="w-full "
                            classNames={{
                                input: "h-10 rounded-2xl lg:h-16 lg:text-lg",
                            }}
                            placeholder="透過關鍵字搜尋"
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") submitSearch();
                            }}
                            rightSection={
                                <button className="h-5" onClick={submitSearch}>
                                    <SearchIcon className="h-full w-full" />
                                </button>
                            }
                        />
                    </div>
                    <div className="mx-auto my-7 w-full text-primary-800">
                        <h2 className="my-3 text-xl lg:my-4 lg:text-2xl">
                            或透過標籤搜尋
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-5">
                            {tags.map((tag, i) => (
                                <button
                                    key={i}
                                    className=" bg-white-100 flex items-center rounded-lg border-[1px] border-primary-700 bg-white px-2 py-1"
                                    onClick={() => {
                                        if (selectedTags.includes(tag)) {
                                            setSelectedTags(
                                                selectedTags.filter(
                                                    (ele) => ele !== tag
                                                )
                                            );
                                        } else {
                                            setSelectedTags((cur) => [
                                                ...cur,
                                                tag,
                                            ]);
                                        }
                                    }}
                                >
                                    <div
                                        className={`h-6 overflow-hidden transition-all ease-out ${
                                            selectedTags.includes(tag)
                                                ? "mr-2 w-6"
                                                : "w-0"
                                        }`}
                                    >
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </div>

                                    <p className="my-auto text-sm lg:text-lg">
                                        {tag}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default SearchMenu;
