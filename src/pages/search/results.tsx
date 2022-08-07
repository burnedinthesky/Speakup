import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
// import { useSession } from 'next-auth/react';
import { showNotification } from "@mantine/notifications";

import Header from "../../components/AppShell/Header";
import Navbar from "../../components/AppShell/Navbar";
import Footbar from "../../components/AppShell/Footbar";
import NavCard from "../../components/Navigation/NavCard";
import { SampleSearchResults } from "../../templateData/navigation";
// import Pagebar from "../../components/navbar/Pagebar";

const SearchResults = () => {
    const router = useRouter();
    const isIdle = false,
        isLoading = false,
        error = null;

    const data = SampleSearchResults;

    // const { data: session } = useSession();

    // const { data, error, isLoading, isIdle, refetch } = useQuery(
    //     "searchres",
    //     async () => {
    //         let response = await fetch(
    //             `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Token ${session.authToken}`,
    //                     Accept: "application/json",
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     searchterm: router.query.searchterm,
    //                 }),
    //             }
    //         );
    //         if (response.ok) return response.json();
    //         let res = await response.json();
    //         throw new Error(res.Error);
    //     },
    //     {
    //         enabled: false,
    //         refetchOnWindowFocus: false,
    //     }
    // );

    useEffect(() => {
        if (router.isReady /*&& session*/) {
            if (router.query.searchterm === undefined) {
                window.location.href = "/search";
            }
            // refetch();
        }
    }, [router.query /*, session*/]);

    if (isIdle || isLoading) {
        return (
            <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden bg-neutral-100 scrollbar-hide">
                <Header />
                <Navbar retractable={false} />
                <Footbar />
                <div className="flex h-screen w-full flex-col items-center pt-14 lg:ml-64 lg:w-[calc(100%-16rem)]">
                    <div className="mt-10 w-[calc(100%-56px)] max-w-3xl md:mt-16 md:w-[calc(100%-160px)] ">
                        <div className="h-10 w-96 animate-pulse rounded-xl bg-neutral-200" />
                        <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                        <div className="mt-6 h-36 w-full animate-pulse rounded-xl bg-neutral-200" />
                    </div>
                </div>
            </div>
        );
    } else if (error) {
        showNotification({
            title: "資料獲取失敗",
            message: "請重新整理頁面",
            color: "red",
            disallowClose: true,
            autoClose: false,
        });
        return (
            <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden bg-neutral-100 scrollbar-hide">
                <Header />
                <Navbar retractable={false} />
                <Footbar />
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen overflow-x-hidden bg-neutral-100 scrollbar-hide">
            <Header />
            <Navbar retractable={false} />
            <Footbar />
            <div className="flex h-screen w-full flex-col items-center pt-14 lg:ml-64 lg:w-[calc(100%-16rem)]">
                <div className="mt-10 w-[calc(100%-56px)] max-w-3xl md:mt-16 md:w-[calc(100%-160px)] ">
                    <h1 className="text-2xl text-primary-800 md:text-3xl">
                        {data.length > 0
                            ? `以下為${router.query.searchterm}的搜尋結果`
                            : `很抱歉，我們找不到符合${router.query.searchterm}的結果`}
                    </h1>
                    <div className="mt-8 flex flex-col gap-6">
                        {data.map((cardContent, i) => (
                            <NavCard
                                key={i}
                                cardContent={cardContent}
                                showDetails={true}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-16 flex-shrink-0"></div>
                {/* <Pagebar
                    maxPage={data.pages}
                    url={(id) => {
                        return `/search/results?searchterm=${router.query.searchTerm}&onpage=${id}`;
                    }}
                    selected={router.query.onpage ? router.query.onpage : 1}
                /> */}
                <div className="mt-16 h-1 w-1 flex-shrink-0" />
            </div>
        </div>
    );
};

export default SearchResults;
