import Link from "next/link";
import {
	HomeIcon,
	SearchIcon,
	BookmarkIcon,
	BellIcon,
} from "@heroicons/react/outline";
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
			className={`fixed left-0 bottom-0 w-screen h-12 z-20 px-5
			flex items-center justify-around bg-white text-primary-600 lg:hidden`}
		>
			<Link href="/home">
				<Highlightable
					highlight={highlight == "home"}
					normal={<HomeIcon className="h-6" />}
					highlighted={<HomeIconSolid className="h-6" />}
				/>
			</Link>
			<Link href="/search">
				<Highlightable
					highlight={highlight == "search"}
					normal={<SearchIcon className="h-6" />}
					highlighted={<SearchIconSolid className="h-6" />}
				/>
			</Link>
			<Link href="/collections">
				<Highlightable
					highlight={highlight == "collections"}
					normal={<BookmarkIcon className="h-6" />}
					highlighted={<BookmarkIconSolid className="h-6" />}
				/>
			</Link>
			{<BellIcon className="h-6" />}
			<AccountOptions />
		</nav>
	);
};

export default Footbar;
