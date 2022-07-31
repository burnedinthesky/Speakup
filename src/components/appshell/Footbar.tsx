import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HomeIcon, SearchIcon, BookmarkIcon, BellIcon, UserCircleIcon } from "@heroicons/react/outline";

import {
    HomeIcon as HomeIconSolid,
    SearchIcon as SearchIconSolid,
    BookmarkIcon as BookmarkIconSolid,
    UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/solid";
import { useRouter } from "next/router";
import AccountOptions from "../Account/AccountOptions";
// import MobileNotifications from './header/MobileNotificationHandler';

const Footbar = () => {
    const router = useRouter();
    const [showNtfModal, setShowNtfModal] = useState(false);

    const pageUrl = (() => {
        let url = "",
            len = router.pathname.length;
        for (let i = 0; i < len; i++) {
            let currentChar = router.pathname[len - i - 1];
            if (i == 0 && currentChar == "/") {
            } else if (currentChar == "/") break;
            url += currentChar;
        }
        return url.split("").reverse().join("");
    })();

    return (
        <nav
            className={`fixed left-0 bottom-0 z-20 h-16 flex w-full items-center justify-around border-t border-gray-400 bg-neutral-50 px-5 text-primary-900 lg:hidden`}
        >
            <Link href="/home">
                <a>{pageUrl == "home" ? <HomeIconSolid className="h-8 w-8" /> : <HomeIcon className="h-8 w-8" />}</a>
            </Link>
            <Link href="/search">
                <a>
                    {pageUrl == "search" || pageUrl == "results" ? (
                        <SearchIconSolid className="h-8 w-8" />
                    ) : (
                        <SearchIcon className="h-8 w-8" />
                    )}
                </a>
            </Link>
            <Link href="/collections">
                <a>
                    {pageUrl == "collections" ? (
                        <BookmarkIconSolid className="h-8 w-8" />
                    ) : (
                        <BookmarkIcon className="h-8 w-8" />
                    )}
                </a>
            </Link>
            {/* <MobileNotifications /> */}
            {/* <Link href="/aboutuser">
                <a>
                    {pageUrl == 'aboutuser' ? (
                        <UserCircleIconSolid className="h-8 w-8" />
                    ) : (
                        <UserCircleIcon className="h-8 w-8" />
                    )}
                </a>
            </Link> */}
            <AccountOptions />
        </nav>
    );
};

export default Footbar;
