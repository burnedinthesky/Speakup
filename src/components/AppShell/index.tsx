import Head from "next/head";
import Header from "./Header";
import Navbar from "./Navbar";
import Footbar from "./Footbar";

interface AppShellProps {
    children?: JSX.Element;
    title: string;
}

const AppShell = ({ children, title }: AppShellProps) => {
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
            <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden bg-neutral-100 scrollbar-hide">
                <Header />
                <Navbar retractable={false} />
                <Footbar />
                {children}
            </div>
        </>
    );
};

export { AppShell, Header, Navbar, Footbar };
