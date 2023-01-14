import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/outline";

import { Header, Footbar } from "components/AppShell";
import HomeNavCard from "./HomeNavCard";
import type { HomeRecommendations } from "types/navigation.types";

interface MobileHomeProps {
	data: HomeRecommendations;
}

const MobileHome = ({ data }: MobileHomeProps) => {
	return (
		<div className="fixed top-0 left-0 h-screen w-screen bg-neutral-50 xl:hidden">
			<Header />
			<Footbar highlight="home" />
			<div className="mx-auto mt-14 mb-16 flex h-[calc(100vh-110px)] w-full max-w-2xl flex-col gap-4 overflow-y-scroll px-6">
				<h2 className="pt-6 font-sans text-2xl font-medium text-primary-800">
					您的議題
				</h2>
				<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
					{data.recommended?.cards?.map((card, i) => (
						<HomeNavCard key={i} cardContent={card} />
					))}
				</div>
				<Link
					href={"/search"}
					// href={`/search/results?searchterm=${data?.tracks[0]?.title}`}
				>
					<div className="text-center text-primary-900">
						<p>探索更多</p>
						<ChevronDownIcon className=" mx-auto w-6" />
					</div>
				</Link>
				<div className="h-16"></div>
			</div>
		</div>
	);
};
export default MobileHome;
