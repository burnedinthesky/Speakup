import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import { Popover } from "@mantine/core";

import { SearchIcon } from "@heroicons/react/outline";
import { ArticleTagValues } from "../../../types/issueTypes";

const DesktopDropdown = () => {
    const [opened, setOpened] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const router = useRouter();

    const searchSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (searchKeyword !== null) {
            router.push(`/search/results?searchterm=${searchKeyword}`);
        }
    };

    return (
        <form className=" w-full items-center md:flex" onSubmit={searchSubmit}>
            <Popover
                opened={opened}
                width="target"
                onChange={setOpened}
                position="bottom"
                shadow="sm"
                offset={10}
            >
                <Popover.Target>
                    <div className="flex w-full">
                        <input
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                            }}
                            className="h-9 w-full rounded-3xl bg-neutral-50 p-5 text-base text-neutral-600 focus:outline-0"
                            placeholder="搜尋你感興趣的議題"
                            type="text"
                            onFocus={() => {
                                setOpened(true);
                            }}
                            onBlur={() => {
                                setOpened(false);
                            }}
                        />
                        <button type="submit" className="relative -left-12">
                            <SearchIcon className="h-6 w-6 text-primary-800" />
                        </button>
                    </div>
                </Popover.Target>
                <Popover.Dropdown>
                    <div className="w-full rounded-full text-primary-800">
                        <h2 className="text-xl">打入關鍵字或以#搜尋</h2>
                        <div className="mt-3 flex flex-wrap gap-2.5 ">
                            {ArticleTagValues.map((tag, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        console.log("yoo");
                                        window.location.href = `/search/results?searchterm=@${tag}`;

                                        console.log("hello");
                                    }}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </Popover.Dropdown>
            </Popover>
        </form>
    );
};

export default DesktopDropdown;
