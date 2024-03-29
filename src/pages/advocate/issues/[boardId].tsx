import { useState, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { prisma } from "../../../utils/prisma";
import { GetServerSideProps } from "next";
import useScreenBreakpoint from "../../../common/hooks/useScreenBreakpoint";

import { Drawer } from "@mantine/core";

import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleEditor from "../../../components/Advocate/Issues/Editor/ArticleEditor";
import ArticleProperties from "../../../components/Advocate/Issues/Editor/ArticleProperties";
import DesktopBlockProperties from "../../../components/Advocate/Issues/Editor/DesktopBlockProperties";

import {
    ArticleBlock,
    ArticleBlockTypes,
    ArticleTagValues,
    TypeArticleTagValues,
} from "../../../types/article.types";
import {
    ArticleStatus,
    AvcArticle,
} from "../../../types/advocate/article.types";
import { articlePropertiesAtom } from "../../../atoms/advocate/articleEditorAtoms";

interface SelectorWrapperProps {
    opened: boolean;
    setOpened: (val: boolean) => void;
    children: JSX.Element;
}

const SelectorWrapper = ({
    opened,
    setOpened,
    children,
}: SelectorWrapperProps) => {
    const { wbpn } = useScreenBreakpoint();

    return wbpn > 2 ? (
        <div className="relative h-full w-72 flex-shrink-0 px-4 xl:w-80">
            <div className="absolute left-0 top-7 h-[calc(100%-56px)] border-r border-r-slate-300" />
            {children}
        </div>
    ) : (
        <Drawer
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            position="right"
            size={360}
        >
            <div className="mx-auto w-80">{children}</div>
        </Drawer>
    );
};

const BoardEditor = ({ article }: { article: AvcArticle }) => {
    const [blockStyles, setBlockStyles] = useState<ArticleBlockTypes[]>(
        article.content.map((block) => block.type)
    );
    const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
    const [queuedBlur, setQueuedBlur] = useState<boolean>(false);
    const setArticleProperties = useSetRecoilState(articlePropertiesAtom);

    const [expandSelectionDrawer, setExpandSelectionDrawer] =
        useState<boolean>(false);

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
            <div className="flex h-full w-full lg:ml-64 lg:w-[calc(100%-256px)]">
                <div className="h-full w-full flex-grow-0 overflow-y-auto px-6 pt-10 pb-20 lg:px-12">
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
                            modStatus={article.modStatus}
                            blockStyles={blockStyles}
                            setBlockStyles={setBlockStyles}
                            focusSelection={(val) => {
                                setFocusedBlock(val);
                                overrideBlur.current = focusedBlock;
                            }}
                            blurSelection={() => {
                                setQueuedBlur(true);
                            }}
                            focusedBlock={focusedBlock}
                            setOverrideBlur={(val) => {
                                overrideBlur.current = val;
                            }}
                            setQueuedBlur={setQueuedBlur}
                            setOpenAtcPropDrawer={setExpandSelectionDrawer}
                        />
                    </div>
                </div>
                <SelectorWrapper
                    opened={expandSelectionDrawer}
                    setOpened={setExpandSelectionDrawer}
                >
                    {focusedBlock !== null ? (
                        <DesktopBlockProperties
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
                </SelectorWrapper>
            </div>
        </AppShell>
    );
};

export default BoardEditor;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const boardId = context?.params?.boardId as string;

    const issue = await prisma.avcArticle.findUnique({
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
            author: {
                select: {
                    name: true,
                    profileImg: true,
                },
            },
            articleInstance: {
                select: {
                    viewCount: true,
                    _count: { select: { arguments: true } },
                },
            },
            status: true,
        },
    });

    if (!issue) {
        return { notFound: true };
    }

    const data: AvcArticle = {
        id: issue.id,
        brief: issue.brief,
        author: issue.author,
        title: issue.title,
        tags: issue.tags as TypeArticleTagValues[],
        content: issue.content as ArticleBlock[],
        references: issue.references,
        viewCount: issue.articleInstance?.viewCount ?? null,
        argumentCount: issue.articleInstance?._count.arguments ?? null,
        modStatus: {
            state: issue.status?.status as ArticleStatus,
            desc: issue.status?.desc as string,
        },
        modPending: 0,
    };

    return {
        props: { article: data },
    };
};
