import { useSession } from "next-auth/react";

import { Header, Navbar } from "../../AppShell";
import CardTrack from "./CardTrack";

import { HomeRecommendations } from "../../../types/navigation.types";

interface DesktopHomeProps {
    data: HomeRecommendations;
}

const DesktopHome = ({ data }: DesktopHomeProps) => {
    const { data: session } = useSession();

    return (
        <div className="fixed top-0 left-0 h-screen w-screen overflow-y-auto bg-neutral-100 pb-20">
            <Header />
            <Navbar retractable={false} />
            <div className="ml-64 mt-16 pl-20 pt-16">
                <h1 className="text-4xl text-primary-800">
                    {session?.user.name} 歡迎回來Speakup!
                </h1>
                <div className="mt-6 flex w-full flex-col gap-9">
                    {Object.entries(data).map((entry, i) => (
                        <CardTrack
                            key={i}
                            title={entry[1].title}
                            cards={entry[1].cards}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesktopHome;
