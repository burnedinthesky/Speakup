import Link from "next/link";

import SearchBar from "../../Navigation/Search/SearchBar";
import AccountOptions from "./AccountOptions";
import { useSession } from "next-auth/react";
import SignupModal from "../../Auth/SignupModal";

const Header = () => {
	const { data: session } = useSession();

	return (
		<>
			<div className="fixed top-0 z-20 h-14 w-screen bg-primary-700 px-6 xl:px-14">
				<div className="flex h-full w-full items-center justify-center lg:hidden">
					<Link href="/home">
						<img
							className="my-auto h-8 -translate-x-1 lg:h-10"
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
						{session && (
							<div className=" w-7/12 max-w-2xl xl:w-5/12">
								<SearchBar />
							</div>
						)}
					</div>
					{session && (
						<div className="flex h-9 items-center justify-end gap-5 ">
							{/* <DesktopNotifications /> */}
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
