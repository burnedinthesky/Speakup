import { ReactElement } from "react";
import Link from "next/link";

import {
	HomeIcon,
	BookmarkIcon,
	FireIcon,
	BellIcon,
} from "@heroicons/react/outline";

import AccountOptions from "./Header/AccountOptions";

interface NavbarSectionProps {
	icon: ReactElement;
	link: string;
	text: string;
}

const NavbarSection = ({ link, icon }: NavbarSectionProps) => {
	return (
		<Link href={link}>
			<li>{icon}</li>
		</Link>
	);
};

const Navbar = () => {
	return (
		<nav
			className={`group fixed top-0 left-0 h-screen w-16 py-11 z-10 hidden lg:flex flex-col justify-between items-center bg-white`}
		>
			<div className="flex flex-col items-center">
				<img className="h-9 w-9" src="/assets/logo-mic.svg" alt="Speakup" />
				<ul className="flex flex-col mt-8 gap-8 items-center text-primary-600">
					<NavbarSection
						link="/home"
						icon={<HomeIcon className="w-7 flex-shrink-0" />}
						text="首頁"
					/>
					<NavbarSection
						link="/search/results?tags=熱門議題"
						icon={<FireIcon className="w-7 flex-shrink-0" />}
						text="熱門議題"
					/>
					<NavbarSection
						link="/collections"
						icon={<BookmarkIcon className="w-7 flex-shrink-0" />}
						text="我的收藏"
					/>
				</ul>
			</div>
			<div className="flex flex-col items-center gap-8 text-primary-600">
				<BellIcon className="w-7" />
				<AccountOptions menuPosition="right-end" />
			</div>
		</nav>
	);
};

export default Navbar;
