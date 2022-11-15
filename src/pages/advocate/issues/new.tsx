import { useState, useEffect, useRef } from "react";

import { AppShell } from "../../../components/Advocate/AppShell";
import ArticleEditor from "../../../components/Advocate/Issues/Editor/ArticleEditor";
import BlockProperties from "../../../components/Advocate/Issues/Editor/BlockProperties";

import { ArticleBlockTypes } from "../../../types/article.types";
import ArticleProperties from "../../../components/Advocate/Issues/Editor/ArticleProperties";
import { articlePropertiesAtom } from "../../../atoms/advocate/articleEditorAtoms";
import { useSetRecoilState } from "recoil";

const BoardEditor = () => {
    const [blockStyles, setBlockStyles] = useState<ArticleBlockTypes[]>([]);
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
            brief: "",
            tags: [],
            errors: {
                brief: null,
                tags: null,
            },
        });
    }, []);

    return (
        <AppShell title={`Speakup -`} highlight="issues">
            <div className="ml-64 flex h-full w-[calc(100%-256px)]">
                <div className="h-full w-full flex-grow-0 overflow-y-auto px-12 pt-10 pb-20">
                    <ArticleEditor
                        blockStyles={blockStyles}
                        setBlockStyles={setBlockStyles}
                        focusBlock={(val) => {
                            setFocusedBlock(val);
                            overrideBlur.current = focusedBlock;
                        }}
                        blurSelection={() => {
                            setQueuedBlur(true);
                        }}
                    />
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
