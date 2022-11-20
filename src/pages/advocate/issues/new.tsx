import { useState, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import useScreenBreakpoint from "../../../common/hooks/useScreenBreakpoint";

import { Drawer } from "@mantine/core";

import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleEditor from "../../../components/Advocate/Issues/Editor/ArticleEditor";
import ArticleProperties from "../../../components/Advocate/Issues/Editor/ArticleProperties";
import DesktopBlockProperties from "../../../components/Advocate/Issues/Editor/DesktopBlockProperties";

import type { ArticleBlockTypes } from "../../../types/article.types";
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

const BoardEditor = () => {
    const [blockStyles, setBlockStyles] = useState<ArticleBlockTypes[]>([]);
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
            brief: "",
            tags: [],
            errors: {
                brief: null,
                tags: null,
            },
        });
    }, []);

    return (
        <AppShell title={`Speakup - 新增議題`} highlight="issues">
            <div className="flex h-full w-full lg:ml-64 lg:w-[calc(100%-256px)]">
                <div className="h-full w-full flex-grow-0 overflow-y-auto px-12 pt-10 pb-20">
                    <div className="mx-auto h-full max-w-3xl">
                        <ArticleEditor
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
