// src/pages/_app.tsx
import { MantineProvider } from "@mantine/core";
import type { AppRouter } from "../server/router/app.router";
import superjson from "superjson";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import { NotificationsProvider } from "@mantine/notifications";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
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
    );
};

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.browser) return ""; // Browser should use current path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp);
