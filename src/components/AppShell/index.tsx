import Head from "next/head";
import Header from "./Header";
import Navbar from "./Navbar";
import Footbar from "./Footbar";

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
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
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
                <Navbar retractable={false} />
                <Footbar highlight={highlight} />
                {children}
            </div>
        </>
    );
};

export { AppShell, Header, Navbar, Footbar };
