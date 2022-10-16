import Link from "next/link";

import SearchBar from "../Navigation/Search/SearchBar";
import AccountOptions from "../Account/AccountOptions";

const Header = () => {
    return (
        <div className="fixed top-0 z-20 h-14 w-screen bg-primary-700 px-6 xl:px-14">
            <div className="flex h-full cursor-pointer items-center lg:hidden">
                <Link href="/home">
                    <img
                        className="my-auto h-10 cursor-pointer"
                        src="/assets/logo-white.svg"
                        alt="logo"
                    />
                </Link>
            </div>

            <div className="hidden items-center justify-between lg:flex">
                <div className="flex h-14 w-screen items-center gap-14">
                    <Link href="/home">
                        <img
                            className="my-auto h-10"
                            src="/assets/logo-white.svg"
                            alt="logo"
                        />
                    </Link>
                    <div className=" w-7/12 max-w-2xl xl:w-5/12">
                        <SearchBar />
                    </div>
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
