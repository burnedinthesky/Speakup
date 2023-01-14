import { Header, Footbar, Navbar } from "../../AppShell";

const MobileLoadingScreen = () => (
	<div className="mt-28">
		<div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
		<div className="mt-6 h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
	</div>
);

const DesktopLoadingScreen = () => (
	<div className="ml-64 mt-16 pl-20 pt-16">
		<h1 className="text-4xl text-primary-800">歡迎回來Speakup</h1>
		<div className="mt-12 flex gap-8">
			<div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
			<div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
		</div>
	</div>
);

export { MobileLoadingScreen, DesktopLoadingScreen };
