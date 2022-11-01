// src/pages/_app.tsx
import type { AppRouter } from "../server/router/app.router";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { withTRPC } from "@trpc/next";
import superjson from "superjson";

import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import Router from "next/router";

import NProgress from "nprogress";

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

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            queryClientConfig: {}, //https://react-query.tanstack.com/reference/QueryClient
        };
    },
    ssr: false, // https://trpc.io/docs/ssr
})(Speakup);
