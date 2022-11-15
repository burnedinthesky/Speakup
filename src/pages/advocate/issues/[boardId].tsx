import { useState, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { prisma } from "../../../utils/prisma";
import { GetServerSideProps } from "next";

import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleEditor from "../../../components/Advocate/Issues/Editor/ArticleEditor";
import BlockProperties from "../../../components/Advocate/Issues/Editor/BlockProperties";

import {
    ArticleBlock,
    ArticleBlockTypes,
    ArticleTags,
} from "../../../types/article.types";
import {
    ArticleStatus,
    AvcArticle,
} from "../../../types/advocate/article.types";
import ArticleProperties from "../../../components/Advocate/Issues/Editor/ArticleProperties";
import { articlePropertiesAtom } from "../../../atoms/advocate/articleEditorAtoms";

const BoardEditor = ({ article }: { article: AvcArticle }) => {
    const [blockStyles, setBlockStyles] = useState<ArticleBlockTypes[]>(
        article.content.map((block) => block.type)
    );
    const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
    const [queuedBlur, setQueuedBlur] = useState<boolean>(false);
    const setArticleProperties = useSetRecoilState(articlePropertiesAtom);

    const overrideBlur = useRef<number | null>(null);

    useEffect(() => {
        if (!queuedBlur) return;
        const timeout = setTimeout(() => {
            if (overrideBlur.current === null) setFocusedBlock(null);
            overrideBlur.current = null;
            setQueuedBlur(false);
        }, 50);
        return () => {
            clearTimeout(timeout);
        };
    }, [queuedBlur]);

    useEffect(() => {
        setArticleProperties({
            brief: article.brief,
            tags: article.tags,
            errors: {
                brief: null,
                tags: null,
            },
        });
    }, [article]);

    return (
        <AppShell
            title={`Speakup - ${article ? article.title : "新議題"}`}
            highlight="issues"
        >
            <div className="ml-64 flex h-full w-[calc(100%-256px)]">
                <div className="h-full w-full flex-grow-0 overflow-y-auto px-12 pt-10 pb-20">
                    <div className="mx-auto h-full max-w-3xl">
                        <ArticleEditor
                            articleId={article.id}
                            initialTitle={article.title}
                            initialContent={article.content.map(
                                (block) => block.content
                            )}
                            initialRefLinks={article.references.map((ref) => ({
                                data: ref,
                                status: "fetched",
                                url: ref.link,
                            }))}
                            blockStyles={blockStyles}
                            setBlockStyles={setBlockStyles}
                            focusSelection={(val) => {
                                setFocusedBlock(val);
                                overrideBlur.current = focusedBlock;
                            }}
                            blurSelection={() => {
                                setQueuedBlur(true);
                            }}
                        />
                    </div>
                </div>
                <div className="relative h-full w-80 flex-shrink-0 px-4">
                    <div className="absolute left-0 top-7 h-[calc(100%-56px)] border-r border-r-slate-300" />
                    {focusedBlock !== null ? (
                        <BlockProperties
                            blockStyles={blockStyles}
                            setBlockStyles={setBlockStyles}
                            focusedBlock={focusedBlock}
                            setOverrideBlur={(val) => {
                                overrideBlur.current = val;
                            }}
                            setQueuedBlur={setQueuedBlur}
                        />
                    ) : (
                        <ArticleProperties />
                    )}
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

    console.log(issue.references);

    const status = issue.status as {
        status: ArticleStatus;
        desc: string;
    };

    const data: AvcArticle = {
        id: issue.id,
        brief: issue.brief,
        author: issue.author,
        title: issue.title,
        tags: issue.tags as ArticleTags[],
        content: issue.content as ArticleBlock[],
        references: issue.references,
        viewCount: issue.viewCount,
        argumentCount: issue._count.arguments,
        status: status.status,
        status_desc: status.desc,
        modPending: 0,
    };

    return {
        props: { article: data },
    };
};
