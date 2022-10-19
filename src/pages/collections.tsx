import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../utils/trpc";

import { AppShell } from "../components/AppShell";
import NavCard from "../components/Navigation/NavCard";
import NoCollectionsDisplay from "../components/Navigation/Collections/NoCollectionsDisplay";
import CollectionSetSelector from "../components/Navigation/Collections/CollectionSetSelector";

const Collections = () => {
    const [selectedSet, setSelectedSet] = useState<number | null>(null);

    const { data, isLoading } = trpc.useInfiniteQuery(
        [
            "navigation.getUserCollections",
            { collectionSet: selectedSet, limit: 20 },
        ],
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const { data: colSets, isLoading: colSetsLoading } = trpc.useQuery([
        "navigation.getCollectionSets",
    ]);

    if (isLoading || colSetsLoading) {
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
    if (!data || !colSets) {
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
                <div className="mx-5 w-full max-w-3xl pt-10 md:w-[calc(100%-160px)] lg:ml-64 lg:pt-20 xl:ml-0 ">
                    {data.pages[0] && data.pages[0].data.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-5">
                                {data.pages
                                    .flat()
                                    .flatMap((ele) => ele.data)
                                    .map((cardContent, i) => (
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
                        sets={colSets}
                        selectedSet={selectedSet}
                        setSelectedSet={setSelectedSet}
                    />
                </div>
            </div>
        </AppShell>
    );
};

export default Collections;
