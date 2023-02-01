import { useSession } from "next-auth/react";

import Head from "next/head";
import Header from "./Header";
import Navbar from "./Navbar";
import FootNav from "./FootNav";

interface AppShellProps {
	children?: JSX.Element;
	title: string;
	rootDivStyle?: string;
	highlight?: "home" | "search" | "collections";
}

const AppShell = ({
	children,
	title,
	rootDivStyle,
	highlight,
}: AppShellProps) => {
	const { data: session } = useSession();

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<div
				className={
					rootDivStyle
						? rootDivStyle
						: `fixed top-0 left-0 right-0 bottom-0 bg-gray-100 scrollbar-hide overflow-x-hidden overflow-y-auto 
						`
				}
			>
				<Header />
				<Navbar />
				<FootNav highlight={highlight} />
				{session && <></>}
				{children}
			</div>
		</>
	);
};

export { AppShell, Header, Navbar, FootNav };
