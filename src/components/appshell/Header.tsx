import { SyntheticEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { SearchIcon } from "@heroicons/react/outline";

// import DesktopNotifications from "./header/DesktopNotificationHandler";
import AccountOptions from "../Account/AccountOptions";

const Header = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const router = useRouter();

    const searchSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (searchKeyword !== null) {
            router.push(`/search/results?searchterm=${searchKeyword}`);
        }
    };

    return (
        <div className="fixed top-0 z-20 h-14 w-screen bg-primary-700 px-6 xl:px-14">
            <div className="flex h-full cursor-pointer items-center lg:hidden">
                <Link href="/home">
                    <img className="my-auto h-10 cursor-pointer" src="/assets/logo-white.svg" alt="logo" />
                </Link>
            </div>

            <div className="hidden items-center justify-between lg:flex">
                <div className="flex h-14 w-screen items-center gap-14">
                    <Link href="/home">
                        <img className="my-auto h-10" src="/assets/logo-white.svg" alt="logo" />
                    </Link>
                    <form className="hidden w-7/12 max-w-2xl items-center md:flex xl:w-5/12" onSubmit={searchSubmit}>
                        <input
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                            }}
                            className="h-9 w-full rounded-3xl bg-neutral-50 p-5 text-base text-neutral-600 focus:outline-0"
                            placeholder="搜尋你感興趣的議題"
                            type="text"
                        />
                        <button type="submit" className="relative -left-12">
                            <SearchIcon className="h-6 w-6 text-primary-800" />
                        </button>
                    </form>
                </div>
                <div className="flex h-9 items-center justify-end gap-5 ">
                    {/* <DesktopNotifications /> */}
                    <AccountOptions />
                </div>
            </div>
        </div>
    );
};

export default Header;
