import { MouseEvent, useEffect, useState } from "react";
import Head from "next/head";
import { ActionIcon, Menu, Tabs } from "@mantine/core";

import Header from "../../components/AppShell/Header";
import Navbar from "../../components/AppShell/Navbar";
import Footbar from "../../components/AppShell/Footbar";
import ArticleViewer from "../../components/Discussion/Article/ArticleViewer";
import CommentField from "../../components/Discussion/Comments/CommentField";

import { Article } from "../../types/issueTypes";
import { Stances } from "../../types/commentTypes";
import { SampleArticle } from "../../templateData/issues";
import { ChevronDownIcon, SortDescendingIcon } from "@heroicons/react/outline";

interface DiscussionProps {
    article: Article;
}

const DiscussionBoard = ({ article }: DiscussionProps) => {
    const [viewingStance, setViewingStance] = useState<string | null>("both");
    const [sortMethod, setSortMethod] = useState<
        "default" | "time" | "replies"
    >("default");
    const [screenSize, setScreenSize] = useState<"mob" | "des">("mob");

    const updateSortMethod = (e: MouseEvent<HTMLButtonElement>) => {
        const updateMode = e.currentTarget.innerText as
            | "預設排序"
            | "依時間排序"
            | "依回覆數排序";
        if (updateMode == "預設排序") setSortMethod("default");
        else if (updateMode == "依時間排序") setSortMethod("time");
        else if (updateMode == "依回覆數排序") setSortMethod("replies");
    };

    useEffect(() => {
        if (window.innerWidth < 1024) setScreenSize("mob");
        else setScreenSize("des");
        window.onresize = () => {
            if (window.innerWidth < 1024) setScreenSize("mob");
            else setScreenSize("des");
        };
        return () => {
            window.onresize = null;
        };
    }, []);

    return (
        <>
            <Head>
                <title>{`Speakup - ${article.title}`}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>

            <main className="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden bg-neutral-100 pt-14 pb-16 scrollbar-hide">
                <Header />
                <Navbar retractable={true} />
                <Footbar />
                <div className="mx-auto w-11/12 max-w-3xl scrollbar-hide lg:px-4">
                    <div className="mt-6 w-full lg:mt-10">
                        <ArticleViewer article={article} />
                        <div className="h-10" />
                        <div className="mx-auto flex w-full justify-between lg:mb-4">
                            <div className="w-full bg-neutral-50 pb-1 pt-0.5 lg:w-1/2 lg:min-w-[360px] lg:rounded-full lg:px-8">
                                <Tabs
                                    color="primary"
                                    value={viewingStance}
                                    variant={
                                        screenSize == "mob"
                                            ? "outline"
                                            : "default"
                                    }
                                    onTabChange={setViewingStance}
                                >
                                    <Tabs.List position="center" grow>
                                        <Tabs.Tab value="sup">支持</Tabs.Tab>
                                        <Tabs.Tab value="both">
                                            無區分立場
                                        </Tabs.Tab>
                                        <Tabs.Tab value="agn">反對</Tabs.Tab>
                                        {screenSize == "mob" && (
                                            <Menu
                                                classNames={{
                                                    dropdown:
                                                        "bg-neutral-50 shadow-lg",
                                                }}
                                            >
                                                <Menu.Target>
                                                    <ActionIcon className="my-[12px] mr-4">
                                                        <SortDescendingIcon className="h-5 w-5" />
                                                    </ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        onClick={
                                                            updateSortMethod
                                                        }
                                                    >
                                                        預設排序
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        onClick={
                                                            updateSortMethod
                                                        }
                                                    >
                                                        依時間排序
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        onClick={
                                                            updateSortMethod
                                                        }
                                                    >
                                                        依回覆數排序
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        )}
                                    </Tabs.List>
                                </Tabs>
                            </div>
                            <div className="hidden lg:block">
                                <Menu
                                    classNames={{
                                        dropdown: "bg-neutral-50 shadow-lg",
                                    }}
                                >
                                    <Menu.Target>
                                        <button className="flex h-[42px] items-center gap-2 rounded-full bg-neutral-50 px-4">
                                            <ChevronDownIcon className="h-5 w-5" />
                                            <p className="text-sm">
                                                選擇排序方式
                                            </p>
                                        </button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={updateSortMethod}>
                                            預設排序
                                        </Menu.Item>
                                        <Menu.Item onClick={updateSortMethod}>
                                            依時間排序
                                        </Menu.Item>
                                        <Menu.Item onClick={updateSortMethod}>
                                            依回覆數排序
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                        <CommentField
                            key={viewingStance + sortMethod}
                            boardId={article.id}
                            onSide={viewingStance as "sup" | "agn" | "both"}
                            sortMethod={sortMethod}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default DiscussionBoard;

export async function getServerSideProps() {
    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/home`
    // );
    // const data = await res.json();

    return { props: { article: SampleArticle } };
}
