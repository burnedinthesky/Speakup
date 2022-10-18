import React, { ReactElement } from "react";
import Link from "next/link";

import {
    HomeIcon,
    TrendingUpIcon,
    BookmarkIcon,
} from "@heroicons/react/outline";
import { ArticleTagValues } from "../../schema/article.schema";
import { ScrollArea } from "@mantine/core";

//prettier-ignore
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
            <li className="flex cursor-pointer list-none gap-4 py-3">
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
            className={`group fixed top-14 left-0 z-10 hidden h-[calc(100vh-56px)] flex-shrink-0 flex-col overflow-hidden overflow-x-hidden rounded-r-[32px] bg-neutral-50 pt-6 transition-width duration-500 ease-out lg:flex ${
                retractable
                    ? "w-20 hover:w-64 hover:drop-shadow-xl lg:flex"
                    : "w-64"
            }`}
        >
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
                        link="/search/results?searchterm=@熱門議題"
                        icon={<TrendingUpIcon className="w-7 flex-shrink-0" />}
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

            <ScrollArea>
                <div
                    className={`flex-grow pb-6 ${
                        retractable ? "hidden group-hover:block" : "block"
                    }`}
                >
                    <ul className="list-none overflow-x-hidden pl-20">
                        {tags.map((tag, i) => (
                            <Link
                                href={`/search/results?searchterm=@${tag}`}
                                key={`link${i}`}
                            >
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
        </nav>
    );
};

export default Navbar;
