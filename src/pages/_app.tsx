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
							//rome-ignore format:
							primary: ["#EAF5F6","#D2EBEE","#B5E0E5","#8ACDD6","#6DC1CB","#15A9BC","#0D91A0","#127A87","#125A63","#13474E"],
							//rome-ignore format:
							neutral: ["#F5FBFC","#EEF6F6","#E2EFF0","#CBDFE1","#94B4B8","#64878B","#4F777B","#406165","#2C4346","#243436"],
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
