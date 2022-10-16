import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";

import Head from "next/head";

import { Footbar, Header, Navbar } from "../components/AppShell";

import {
    DesktopLoadingScreen,
    MobileLoadingScreen,
} from "../components/Navigation/Home/LoadingScreens";
import MobileHome from "../components/Navigation/Home/MobileHome";
import DesktopHome from "../components/Navigation/Home/DesktopHome";
import { showNotification } from "@mantine/notifications";

const UserHome = () => {
    const [homeVer, setHomeVer] = useState<"mob" | "des">("mob");
    const [sentErrorNotification, setSendErrorNotification] =
        useState<boolean>(false);

    const { data, isLoading } = trpc.useQuery(["navigation.home"]);

    useEffect(() => {
        function updateScreen() {
            setHomeVer(window.innerWidth <= 1024 ? "mob" : "des");
        }
        updateScreen();
        window.onresize = updateScreen;
        return () => {
            window.onresize = null;
        };
    }, []);

    if (isLoading) {
        return (
            <>
                <Head>
                    <title>{`Speakup - 首頁`}</title>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                </Head>
                {homeVer === "mob" ? (
                    <MobileLoadingScreen />
                ) : (
                    <DesktopLoadingScreen />
                )}
            </>
        );
    }

    if (!data) {
        if (!sentErrorNotification) {
            showNotification({
                title: "載入錯誤",
                message: "請重新整理網頁",
                color: "red",
            });
            setSendErrorNotification(true);
        }
        return (
            <>
                <Head>
                    <title>{`Speakup - 首頁`}</title>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                    <link rel="manifest" href="/site.webmanifest" />
                </Head>
                <div className="fixed top-0 left-0 flex h-screen w-screen justify-center bg-neutral-50">
                    <Header />
                    <Navbar retractable={false} />
                    <Footbar />
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`Speakup - 首頁`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            {homeVer == "mob" ? (
                <MobileHome data={data} />
            ) : (
                <DesktopHome data={data} />
            )}
        </>
    );
};

export default UserHome;

// export async function getServerSideProps() {
//     const { data } = trpc.useQuery(["navigation.home"]);

//     return { props: { data } };
// }
