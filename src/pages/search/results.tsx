import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

import { AppShell } from "../../components/AppShell";
import NavCard from "../../components/Navigation/NavCard";

import { trpc } from "../../utils/trpc";
import { Pagination } from "@mantine/core";

interface SearchParams {
    keyword: string | null;
    tags: string[] | null;
    onPage: number | null;
}

const SearchResults = () => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState<SearchParams>({
        keyword: null,
        tags: null,
        onPage: null,
    });

    const {
        data: results,
        error,
        isFetched,
        isLoading,
        refetch,
    } = trpc.useQuery(
        [
            "navigation.search",
            {
                keyword: searchParams.keyword,
                tags: searchParams.tags,
                onPage: searchParams.onPage,
            },
        ],
        {
            // enabled: false,
        }
    );

    useEffect(() => {
        if (router.isReady) {
            console.log("here");

            let keyword: string | null = null,
                tags: string[] | null = null,
                onPage: number | null = null;
            if (typeof router.query.keyword === "string") {
                keyword = router.query.keyword;
            }

            if (typeof router.query.tags === "string") {
                console.log(router.query.tags);
                tags = router.query.tags.split(",");
            }

            if (typeof router.query.page === "string") {
                onPage = parseInt(router.query.page);
            }

            console.log({
                keyword: keyword,
                tags: tags,
                onPage: onPage,
            });

            if (!keyword && !tags) router.push("/search");
            setSearchParams({
                keyword: keyword,
                tags: tags,
                onPage: onPage,
            });

            refetch();
        }
    }, [router.isReady, router.query]);

    if (!isFetched || isLoading) {
        return (
            <AppShell title="Speakup搜尋">
                <div className="flex h-screen w-full flex-col items-center pt-14 lg:ml-64 lg:w-[calc(100%-16rem)]">
                    <div className="mt-10 w-[calc(100%-56px)] max-w-3xl md:mt-16 md:w-[calc(100%-160px)] ">
                        <div className="h-10 w-96 animate-pulse rounded-xl bg-neutral-200" />
                        <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                        <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                    </div>
                </div>
            </AppShell>
        );
    }

    if (error || !results) {
        showNotification({
            title: "資料獲取失敗",
            message: "請重新整理頁面 ",
            color: "red",
            disallowClose: true,
            autoClose: false,
        });
        return <AppShell title="Speakup搜尋" />;
    }

    return (
        <AppShell title="Speakup 搜尋">
            <div className="flex h-screen w-full flex-col items-center pt-14 lg:ml-64 lg:w-[calc(100%-16rem)]">
                <div className="mt-10 w-[calc(100%-56px)] max-w-3xl md:mt-16 md:w-[calc(100%-160px)] ">
                    <h1 className="text-2xl text-primary-800 md:text-3xl">
                        {results.data.length > 0
                            ? `以下為${searchParams.keyword}的搜尋結果`
                            : `很抱歉，我們找不到符合${searchParams.keyword}的結果`}
                    </h1>
                    <div className="mt-8 flex flex-col gap-6">
                        {results.data.map((cardContent, i) => (
                            <NavCard
                                key={i}
                                cardContent={cardContent}
                                showDetails={true}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-16 flex-shrink-0"></div>
                <Pagination
                    page={searchParams.onPage ? searchParams.onPage : 1}
                    onChange={(page) => {
                        let params = new URLSearchParams();
                        if (searchParams.keyword)
                            params.set("keyword", searchParams.keyword);
                        if (searchParams.tags)
                            params.set("tags", searchParams.tags.toString());
                        params.set("page", page.toString());
                        router.push(`/search/results?${params.toString()}`);
                    }}
                    total={results.hasPages}
                    withControls={false}
                />
                <div className="mt-16 h-1 w-1 flex-shrink-0" />
            </div>
        </AppShell>
    );
};

export default SearchResults;
