import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

import { AppShell } from "../components/AppShell";
import NavCard from "../components/Navigation/NavCard";
import NoCollectionsDisplay from "../components/Navigation/Collections/NoCollectionsDisplay";

import { SampleCollections } from "../templateData/navigation";
import CollectionSetSelector from "../components/Navigation/Collections/CollectionSetSelector";
import { useState } from "react";

const Collections = () => {
    const router = useRouter();

    const isIdle = false,
        isLoading = false,
        error = null;

    const data = SampleCollections;

    const [selectedSet, setSelectedSet] = useState<number | null>(null);

    if (isIdle || isLoading) {
        return (
            <AppShell title="Speakup收藏">
                <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden bg-neutral-100 scrollbar-hide">
                    <div className="flex h-screen w-full flex-col items-center pt-14 lg:ml-64 lg:w-[calc(100%-16rem)]">
                        <div className="mt-10 w-[calc(100%-56px)] max-w-3xl md:mt-16 md:w-[calc(100%-160px)] ">
                            <div className="h-10 w-96 animate-pulse rounded-xl bg-neutral-200" />
                            <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                            <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                        </div>
                    </div>
                </div>
            </AppShell>
        );
    }
    if (error) {
        showNotification({
            title: "資料獲取失敗",
            message: "請重新整理頁面",
            color: "red",
            disallowClose: true,
            autoClose: false,
        });
        return <AppShell title="Speakup收藏" />;
    }

    return (
        <AppShell title="Speakup收藏">
            <div className="fixed top-0 left-0 flex h-screen w-screen justify-center overflow-y-auto pt-14">
                <div className="w-full max-w-3xl pt-20 md:w-[calc(100%-160px)]">
                    {data.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-8">
                                {data.map((cardContent, i) => (
                                    <NavCard
                                        key={i}
                                        cardContent={cardContent}
                                        showDetails={false}
                                    />
                                ))}
                            </div>
                            <div className="h-16 flex-shrink-0"></div>
                            <div className="mt-16 h-1 w-1 flex-shrink-0" />
                        </>
                    ) : (
                        <NoCollectionsDisplay />
                    )}
                    <CollectionSetSelector
                        sets={[]}
                        selectedSet={selectedSet}
                        setSelectedSet={setSelectedSet}
                    />
                </div>
            </div>
        </AppShell>
    );
};

export default Collections;
