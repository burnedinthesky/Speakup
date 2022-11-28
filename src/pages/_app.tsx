// src/pages/_app.tsx

import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import Router from "next/router";

import NProgress from "nprogress";

import "@tremor/react/dist/esm/tremor.css";

interface AppPropsInterface {
    session: Session | null | undefined;
}

const Speakup = ({ Component, pageProps }: AppProps<AppPropsInterface>) => {
    Router.events.on("routeChangeStart", () => {
        NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
        NProgress.done();
    });

    Router.events.on("routeChangeError", () => {
        NProgress.done();
    });

    return (
        <SessionProvider session={pageProps.session}>
            <RecoilRoot>
                <MantineProvider
                    theme={{
                        colors: {
                            primary: [
                                "#EAF5F6",
                                "#D2EBEE",
                                "#B5E0E5",
                                "#8ACDD6",
                                "#6DC1CB",
                                "#50B4C1",
                                "#32A8B6",
                                "#159BAC",
                                "#0C8C9C",
                                "#087E8C",
                            ],
                            neutral: [
                                "#F2FBFC",
                                "#D8E8EA",
                                "#B2D4D8",
                                "#92B7BC",
                                "#7BA4A9",
                                "#659096",
                                "#4F777B",
                                "#406165",
                                "#2C4346",
                                "#243436",
                            ],
                        },
                        primaryColor: "primary",
                        primaryShade: 6,
                    }}
                >
                    <NotificationsProvider>
                        <Component {...pageProps} />;
                    </NotificationsProvider>
                </MantineProvider>
            </RecoilRoot>
        </SessionProvider>
    );
};

export default trpc.withTRPC(Speakup);
