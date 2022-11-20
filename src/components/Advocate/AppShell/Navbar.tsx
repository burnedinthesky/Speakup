import Link from "next/link";

import {
    ChatIcon,
    ClipboardCheckIcon,
    CollectionIcon,
    HomeIcon,
} from "@heroicons/react/outline";
import AccountOptions from "./AccountOptions";

interface NavbarSectionProps {
    icon: JSX.Element;
    link: string;
    text: string;
    highlight?: boolean;
}

const NavbarSection = ({ link, icon, text, highlight }: NavbarSectionProps) => {
    return (
        <Link href={link}>
            <div
                className={`flex items-center gap-3 rounded-md bg-opacity-40 px-3 py-2 text-slate-600 transition-colors ${
                    highlight
                        ? "bg-primary-100 hover:bg-opacity-60"
                        : "hover:bg-slate-200"
                } `}
            >
                {icon}
                <p className="font-bold">{text}</p>
            </div>
        </Link>
    );
};

const Navbar = ({
    mobileShow,
    highlight,
}: {
    mobileShow?: boolean;
    highlight?: string;
}) => {
    return (
        <nav
            className={`bg-whit group absolute top-0 left-0 z-10
                h-full w-64 flex-shrink-0 border-r border-neutral-100 lg:fixed
                ${mobileShow ? "flex" : "hidden lg:flex"}`}
        >
            <div className="relative flex h-full w-full flex-col overflow-hidden px-6 pt-10">
                <img
                    className="h-9 w-40 -translate-x-1 lg:h-10"
                    src="/assets/logo-black.svg"
                    alt="logo"
                />
                <div className="mt-7 flex w-full flex-col gap-2">
                    <NavbarSection
                        link="/advocate"
                        icon={<HomeIcon className="h-6 w-6" />}
                        text="首頁"
                        highlight={highlight === "home"}
                    />
                    <NavbarSection
                        link="/advocate/issues"
                        icon={<CollectionIcon className="h-6 w-6" />}
                        text="議題"
                        highlight={highlight === "issues"}
                    />
                    <NavbarSection
                        link="/advocate/comments"
                        icon={<ChatIcon className="h-6 w-6" />}
                        text="留言管理"
                        highlight={highlight === "comments"}
                    />
                    <NavbarSection
                        link="/advocate"
                        icon={<ClipboardCheckIcon className="h-6 w-6" />}
                        text="待辦事項"
                        highlight={highlight === "todo"}
                    />
                </div>
                <AccountOptions />
            </div>
        </nav>
    );
};

export default Navbar;
