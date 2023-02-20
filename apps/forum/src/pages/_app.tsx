import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

import { MantineTheme } from "@/lib/mantine/ProviderConfig";
// import "@tremor/react/dist/esm/tremor.css";

interface AppPropsInterface {
	session: Session | null | undefined;
}

const Speakup = ({ Component, pageProps }: AppProps<AppPropsInterface>) => {
	return (
		<SessionProvider session={pageProps.session}>
			<MantineProvider withGlobalStyles withNormalizeCSS theme={MantineTheme}>
				<NotificationsProvider>
					<Component {...pageProps} />
				</NotificationsProvider>
			</MantineProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(Speakup);
