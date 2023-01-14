import Link from "next/link";
import { HomeIcon, SearchIcon, BookmarkIcon } from "@heroicons/react/outline";
import {
	HomeIcon as HomeIconSolid,
	SearchIcon as SearchIconSolid,
	BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/solid";

import AccountOptions from "./Header/AccountOptions";

interface FootbarProps {
	highlight?: "home" | "search" | "collections";
}

interface HighlightableProps {
	highlight: boolean;
	normal: JSX.Element;
	highlighted: JSX.Element;
}

const Highlightable = ({
	highlight,
	normal,
	highlighted,
}: HighlightableProps) => {
	return <>{highlight ? highlighted : normal}</>;
};

const Footbar = ({ highlight }: FootbarProps) => {
	return (
		<nav
			className={`fixed left-0 bottom-0 z-20 flex h-12 w-full items-center justify-around border-t border-gray-400 bg-neutral-50 px-5 text-primary-900 lg:hidden`}
		>
			<Link href="/home">
				<Highlightable
					highlight={highlight == "home"}
					normal={<HomeIcon className="h-7" />}
					highlighted={<HomeIconSolid className="h-7" />}
				/>
			</Link>
			<Link href="/search">
				<Highlightable
					highlight={highlight == "search"}
					normal={<SearchIcon className="h-7" />}
					highlighted={<SearchIconSolid className="h-7" />}
				/>
			</Link>
			<Link href="/collections">
				<Highlightable
					highlight={highlight == "collections"}
					normal={<BookmarkIcon className="h-7" />}
					highlighted={<BookmarkIconSolid className="h-7" />}
				/>
			</Link>
			{/* <MobileNotifications /> */}
			{/* <Link href="/aboutuser">
                <a>
                    {pageUrl == 'aboutuser' ? (
                        <UserCircleIconSolid className="h-7" />
                    ) : (
                        <UserCircleIcon className="h-7" />
                    )}
                </a>
            </Link> */}
			<AccountOptions />
		</nav>
	);
};

export default Footbar;
