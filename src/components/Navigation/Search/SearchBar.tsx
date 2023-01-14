import { useState } from "react";
import { useRouter } from "next/router";

import { Popover } from "@mantine/core";
import { SearchIcon } from "@heroicons/react/outline";

import { isEqual } from "lodash";
import { ArticleTagValues } from "types/article.types";

const SearchBar = () => {
	const [opened, setOpened] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [prevSelectedTags, setPrevSelectedTags] = useState<string[]>([""]);

	const router = useRouter();

	const searchSubmit = () => {
		if (searchKeyword.length || selectedTags.length) {
			let params = new URLSearchParams();
			if (searchKeyword.length) params.set("keyword", searchKeyword);
			if (selectedTags.length) params.set("tags", selectedTags.toString());

			setOpened(false);
			setSearchKeyword("");
			setSelectedTags([]);
			setPrevSelectedTags([""]);
			router.push(`/search/results?${params.toString()}`);
		}
	};

	return (
		<div className="w-full items-center md:flex">
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
							className="h-9 w-full rounded-3xl bg-neutral-50 p-5 text-base text-neutral-600 focus:outline-none"
							placeholder="搜尋你感興趣的議題"
							type="text"
							onFocus={() => {
								setOpened(true);
							}}
							onBlur={() => {
								if (!isEqual(selectedTags, prevSelectedTags)) {
									setPrevSelectedTags(selectedTags);
								} else setOpened(false);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") searchSubmit();
							}}
						/>
						<button onClick={searchSubmit} className="relative -left-12">
							<SearchIcon className="h-6 w-6 text-primary-800" />
						</button>
					</div>
				</Popover.Target>
				<Popover.Dropdown>
					<div className="w-full rounded-full text-primary-800">
						<h2 className="text-xl">使用標籤搜尋</h2>
						<div className="mt-3 flex flex-wrap gap-2.5 ">
							{ArticleTagValues.map((tag, i) => (
								<button
									key={i}
									onClick={() => {
										if (selectedTags.includes(tag)) {
											setSelectedTags(
												selectedTags.filter((ele) => ele !== tag),
											);
										} else {
											if (selectedTags.length < 4)
												setSelectedTags(selectedTags.concat(tag));
										}
									}}
									className={`flex items-center justify-center ${
										selectedTags.includes(tag)
											? "rounded-lg bg-primary-700 px-1.5 py-1 text-sm text-white"
											: ""
									}`}
								>
									#{tag}
								</button>
							))}
						</div>
					</div>
				</Popover.Dropdown>
			</Popover>
		</div>
	);
};

export default SearchBar;
