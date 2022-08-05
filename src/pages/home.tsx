import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { showNotification } from "@mantine/notifications";

import Link from "next/link";
import { ChevronDownIcon, SearchCircleIcon } from "@heroicons/react/outline";

import Header from "../components/AppShell/Header";
import Footbar from "../components/AppShell/Footbar";
import Navbar from "../components/AppShell/Navbar";

import HomeNavCard from "../components/Navigation/HomeNavCard";

// import { useSession } from "next-auth/react";
import { HomeRecommendations } from "../types/navigationTypes";
import Head from "next/head";
import { SampleArticle } from "../templateData/issues";

const UserHome = () => {
    // const { data: session } = useSession();
    const [homeVer, setHomeVer] = useState<"mob" | "des">("mob");
    const [errDisplayed, setErrDisplayed] = useState(false);

    const data: HomeRecommendations = {
        recommended: {
            title: "為您推薦",
            cards: [SampleArticle],
        },
        med: {
            title: "讚喔",
            cards: [SampleArticle],
        },
    };

    const isLoading = false;

    // const { data, error, isLoading, refetch } = useQuery(
    //     "home",
    //     async () => {
    //         let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/home`, {
    //             headers: {
    //                 Authorization: `Token ${session?.authToken}`,
    //             },
    //         });
    //         if (!response.ok) throw new Error("Fetch failed");
    //         return response.json();
    //     },
    //     { refetchOnWindowFocus: false, enabled: false }
    // );

    // useEffect(() => {
    //     if (session) refetch();
    // }, [session]);

    // useEffect(() => {
    //     if (!errDisplayed && error) {
    //         showNotification({
    //             title: "資料獲取失敗",
    //             message: "請重新整理頁面",
    //             color: "red",
    //             disallowClose: true,
    //             autoClose: false,
    //         });
    //         setErrDisplayed(true);
    //     }
    // }, [error]);

    useEffect(() => {
        function updateScreen() {
            setHomeVer(window.innerWidth <= 1024 ? "mob" : "des");
        }
        updateScreen();
        window.onresize = updateScreen;
        return () => {
            window.onresize = null;
        };
    }, []);

    // if (error) {
    //     return (
    //         <div
    //             className={`fixed top-0 left-0 h-screen w-screen ${
    //                 homeVer === "mob" ? "bg-neutral-50" : "bg-neutral-100"
    //             } `}
    //         >
    //             <Header />
    //             <Navbar />
    //             <Footbar />
    //         </div>
    //     );
    // } else

    if (isLoading)
        return (
            <>
                {homeVer == "mob" ? (
                    <div className="fixed top-0 left-0 flex h-screen w-screen justify-center bg-neutral-50">
                        <Footbar />
                        <Header />
                        <div className="mt-28">
                            <div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
                            <div className="mt-6 h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
                        </div>
                    </div>
                ) : (
                    <div className="fixed top-0 left-0 h-screen w-screen bg-neutral-100">
                        <Header />
                        <Navbar retractable={false} />
                        <div className="ml-64 mt-16 pl-20 pt-16">
                            <h1 className="text-4xl text-primary-800">歡迎回來Speakup</h1>
                            <div className="mt-12 flex gap-8">
                                <div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
                                <div className="h-36 w-96 animate-pulse rounded-xl bg-neutral-200" />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );

    return (
        <>
            <Head>
                <title>{`Speakup - 首頁`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            {homeVer == "mob" ? (
                <div className="fixed top-0 left-0 h-screen w-screen bg-neutral-50 xl:hidden">
                    <Footbar />
                    <div className="absolute top-0 left-0 right-0 h-[30vh] min-h-[208px] bg-primary-600 pt-12">
                        <img className="mx-auto w-20" src="/assets/logo-mic.svg" />
                        <h1 className="mt-4 text-center text-2xl text-white">歡迎回來Speakup</h1>
                    </div>
                    <div className="mt-[calc(max(30vh,208px))] mb-16 flex h-[calc(100vh-max(30vh,208px)-64px)] w-full flex-col gap-4 overflow-y-scroll px-12">
                        <h2 className="pt-6 text-xl">{data?.recommended?.title}</h2>
                        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                            {data?.recommended?.cards?.map((card, i) => (
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
            ) : (
                <div className="fixed top-0 left-0 h-screen w-screen overflow-y-auto bg-neutral-100 pb-20">
                    <Header />
                    <Navbar retractable={false} />
                    <div className="ml-64 mt-16 pl-20 pt-16">
                        <h1 className="text-4xl text-primary-800">
                            {"使用者" /*session?.user?.name*/} 歡迎回來Speakup!
                        </h1>
                        <div className="mt-6 flex w-full flex-col gap-9">
                            {Object.entries(data).map((entry, i) => (
                                <div key={i}>
                                    <h2 className="text-2xl text-primary-800">{entry[1]?.title}</h2>
                                    <div className="flex ">
                                        <div className="mt-6 flex gap-9 overflow-x-auto pb-3.5 scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-500">
                                            {entry[1].cards.map((card, i) => (
                                                <div className="w-96 flex-shrink-0 " key={i}>
                                                    <HomeNavCard cardContent={card} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex w-20 flex-shrink-0 items-center justify-center">
                                            <a
                                                href={"/search"}
                                                // href={`/search/results?searchterm=@${track.title}`}
                                                className=" w-10 rounded-full text-primary-700"
                                            >
                                                <SearchCircleIcon />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserHome;

// export async function getServerSideProps() {
//     const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/home`
//     );
//     const data = await res.json();

//     return { props: { data } };
// }
