import { prisma } from "../../../../utils/prisma";
import { GetServerSideProps } from "next";

import { AppShell } from "../../../../components/Advocate/AppShell";

import ArticleViewer from "../../../../components/Article/ArticleViewer";

import {
    Article,
    ArticleBlock,
    TypeArticleTagValues,
} from "../../../../types/article.types";
import { Tabs } from "@mantine/core";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import IssuePassPanel from "../../../../components/Advocate/Issues/Moderation/IssuePass";
import { useState } from "react";
import IssueFailedPanel from "../../../../components/Advocate/Issues/Moderation/IssueFailed";

const BoardEditor = ({ article }: { article: Article }) => {
    const [activeTab, setActiveTab] = useState<string | null>("pass");

    return (
        <AppShell
            title={`Speakup - ${article ? article.title : "新議題"}`}
            highlight="issueMod"
        >
            <div className="ml-64 mb-10 flex justify-center scrollbar-hide ">
                <div className="w-full max-w-4xl px-4 pb-40">
                    <ArticleViewer
                        className="mx-auto w-full px-9"
                        article={article}
                        showInteractions={false}
                        classNames={{
                            title: "text-3xl text-slate-900",
                            blockStyles: {
                                h1: "text-2xl text-slate-800",
                                h2: "text-xl text-slate-800",
                                h3: "text-lg text-slate-800",
                                p: "text-baes text-slate-600",
                            },
                        }}
                    />
                    <hr className="my-6 w-full border-b border-b-slate-400" />
                    <Tabs
                        color="cyan"
                        value={activeTab}
                        onTabChange={setActiveTab}
                    >
                        <Tabs.List>
                            <Tabs.Tab
                                value="pass"
                                icon={<CheckIcon className="w-4" />}
                            >
                                通過
                            </Tabs.Tab>
                            <Tabs.Tab
                                value="failed"
                                icon={<XIcon className="w-4" />}
                            >
                                不通過
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="pass">
                            <IssuePassPanel articleId={article.id} />
                        </Tabs.Panel>

                        <Tabs.Panel value="failed">
                            <IssueFailedPanel articleId={article.id} />
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </AppShell>
    );
};

export default BoardEditor;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const boardId = context?.params?.boardId as string;

    const issue = await prisma.articles.findUnique({
        where: {
            id: boardId,
        },
        select: {
            id: true,
            title: true,
            tags: true,
            brief: true,
            content: true,
            references: {
                select: {
                    title: true,
                    description: true,
                    img: true,
                    link: true,
                },
            },
            viewCount: true,
            author: {
                select: {
                    name: true,
                    profileImg: true,
                },
            },
            _count: { select: { arguments: true } },
            status: true,
        },
    });

    if (!issue) {
        return { notFound: true };
    }

    const data: Article = {
        id: issue.id,
        brief: issue.brief,
        author: issue.author,
        title: issue.title,
        tags: issue.tags as TypeArticleTagValues[],
        content: issue.content as ArticleBlock[],
        references: issue.references,
        viewCount: issue.viewCount,
        argumentCount: issue._count.arguments,
    };

    return {
        props: { article: data },
    };
};
