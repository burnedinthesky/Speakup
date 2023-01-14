import { ReactElement } from "react";
import Link from "next/link";

import { ScrollArea } from "@mantine/core";
import {
	HomeIcon,
	BookmarkIcon,
	ShieldExclamationIcon,
	FireIcon,
} from "@heroicons/react/outline";

import { ArticleTagValues } from "types/article.types";

const tags = ArticleTagValues;

interface NavbarSectionProps {
	retractable: boolean;
	icon: ReactElement;
	link: string;
	text: string;
}

const NavbarSection = ({
	retractable,
	link,
	icon,
	text,
}: NavbarSectionProps) => {
	return (
		<Link href={link}>
			<li className="flex  list-none gap-4 py-3">
				{icon}
				<p
					className={`whitespace-nowrap text-xl leading-8 ${
						retractable
							? "text-transparent group-hover:text-primary-900"
							: "text-primary-900"
					} `}
				>
					{text}
				</p>
			</li>
		</Link>
	);
};

const Navbar = ({ retractable }: { retractable: boolean }) => {
	return (
		<nav
			className={`group fixed top-14 left-0 z-10 hidden h-[calc(100vh-56px)] flex-shrink-0 rounded-r-md bg-neutral-50 transition-width duration-500 ease-out lg:flex ${
				retractable ? "w-20 hover:w-64 hover:drop-shadow-xl lg:flex" : "w-64"
			}`}
		>
			<div className="relative flex h-full w-full flex-col overflow-hidden pt-6">
				<div className="h-44 w-full">
					<ul className="mx-auto pl-7 text-primary-900">
						<NavbarSection
							retractable={retractable}
							link="/home"
							icon={<HomeIcon className="w-7 flex-shrink-0" />}
							text="首頁"
						/>
						<NavbarSection
							retractable={retractable}
							link="/search/results?tags=熱門議題"
							icon={<FireIcon className="w-7 flex-shrink-0" />}
							text="熱門議題"
						/>
						<NavbarSection
							retractable={retractable}
							link="/collections"
							icon={<BookmarkIcon className="w-7 flex-shrink-0" />}
							text="我的收藏"
						/>
					</ul>
				</div>

				<hr className="my-3 mx-auto w-5/6 border-t-2 border-gray-300" />

				<ScrollArea className="h-[calc(100vh-360px)]">
					<div
						className={`flex-grow pb-6  ${
							retractable ? "hidden group-hover:block" : "block"
						}`}
					>
						<ul className="list-none pl-20 overflow-x-hidden">
							{tags.map((tag, i) => (
								<Link href={`/search/results?tags=${tag}`} key={`link${i}`}>
									<li
										key={i}
										className="cursor-pointer whitespace-nowrap py-2 text-lg text-primary-900 "
									>
										{tag}
									</li>
								</Link>
							))}
						</ul>
					</div>
				</ScrollArea>

				<div className="absolute bottom-0 left-0 flex h-20 w-full items-center gap-4 px-7">
					<ShieldExclamationIcon className="h-6 w-6 flex-shrink-0" />
					<div
						className={`${retractable ? "hidden" : "block"} group-hover:block`}
					>
						<a
							href="https://speakup.canny.io/bugs"
							target="_blank"
							rel="noopener noreferrer"
						>
							<p className="w-[160px] text-sm text-neutral-700">
								Speakup目前正在測試階段，請到 Canny 回報錯誤，協助我們改進
							</p>
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
