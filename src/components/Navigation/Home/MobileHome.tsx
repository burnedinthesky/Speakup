import { ChevronDownIcon } from "@heroicons/react/outline";
import { Footbar } from "../../AppShell";
import HomeNavCard from "./HomeNavCard";
import Link from "next/link";
import { HomeRecommendations } from "../../../schema/navigation.schema";

interface MobileHomeProps {
    data: HomeRecommendations;
}

const MobileHome = ({ data }: MobileHomeProps) => {
    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-neutral-50 xl:hidden">
            <Footbar />
            <div className="absolute top-0 left-0 right-0 h-[30vh] min-h-[208px] bg-primary-600 pt-12">
                <img className="mx-auto w-20" src="/assets/logo-mic.svg" />
                <h1 className="mt-4 text-center text-2xl text-white">
                    歡迎回來Speakup
                </h1>
            </div>
            <div className="mt-[calc(max(30vh,208px))] mb-16 flex h-[calc(100vh-max(30vh,208px)-64px)] w-full flex-col gap-4 overflow-y-scroll px-12">
                <h2 className="pt-6 text-xl text-primary-800">
                    {data.recommended?.title}
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
                    <div className="cursor-pointer text-center text-primary-900">
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
