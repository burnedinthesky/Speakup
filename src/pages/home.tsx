import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";

import Head from "next/head";

import { AppShell } from "../components/AppShell";

import {
    DesktopLoadingScreen,
    MobileLoadingScreen,
} from "../components/Navigation/Home/LoadingScreens";
import MobileHome from "../components/Navigation/Home/MobileHome";
import DesktopHome from "../components/Navigation/Home/DesktopHome";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";

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
            <AppShell title="Speakup - 首頁">
                {homeVer === "mob" ? (
                    <MobileLoadingScreen />
                ) : (
                    <DesktopLoadingScreen />
                )}
            </AppShell>
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
        return <AppShell title="Speakup - 首頁" />;
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
