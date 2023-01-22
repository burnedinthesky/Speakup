import Link from "next/link";
import { useSession } from "next-auth/react";

import SearchBar from "components/Navigation/Search/SearchBar";
import SignupModal from "components/Auth/SignupModal";
import AccountOptions from "./AccountOptions";
import { BellIcon } from "@heroicons/react/outline";

const Header = () => {
	const { data: session } = useSession();

	return (
		<>
			<div className="fixed top-0 z-20 h-12 w-screen bg-white shadow flex lg:hidden justify-center lg:justify-between items-center px-8 xl:px-14">
				<div>
					<Link href="/home">
						<img className="h-7" src="/assets/logo-cyan.svg" alt="Speakup" />
					</Link>
				</div>

				<div className="hidden items-center gap-3 lg:flex">
					<BellIcon className="w-7 text-primary-600" />
					{session && (
						<div className="flex h-9 items-center justify-end gap-5 ">
							<AccountOptions />
						</div>
					)}
				</div>
			</div>
			<SignupModal />
		</>
	);
};

export default Header;
