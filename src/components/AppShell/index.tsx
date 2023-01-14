import Head from "next/head";
import Header from "./Header";
import Navbar from "./Navbar";
import Footbar from "./Footbar";
import { useSession } from "next-auth/react";

interface AppShellProps {
	children?: JSX.Element;
	title: string;
	rootDivStyle?: string;
	highlight?: "home" | "search" | "collections";
	navbarRetractable?: boolean;
}

const AppShell = ({
	children,
	title,
	rootDivStyle,
	highlight,
	navbarRetractable,
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
						: `fixed top-0 left-0 h-screen w-screen bg-neutral-100 scrollbar-hide overflow-x-hidden`
				}
			>
				<Header />
				{session && (
					<>
						<Navbar
							retractable={
								navbarRetractable !== undefined ? navbarRetractable : false
							}
						/>
						<Footbar highlight={highlight} />
					</>
				)}
				{children}
			</div>
		</>
	);
};

export { AppShell, Header, Navbar, Footbar };
