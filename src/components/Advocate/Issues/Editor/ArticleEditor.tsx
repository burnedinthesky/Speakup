import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { useRouter } from "next/router";

import { trpc } from "../../../../utils/trpc";

import { showNotification } from "@mantine/notifications";
import { checkArticleData } from "../../../../lib/advocate/articleEditor";

import { Button, LoadingOverlay, TextInput } from "@mantine/core";

import ArticleContent from "./ArticleContent";
import ArticleReferences from "./ArticleReferences";
import { articlePropertiesAtom } from "../../../../atoms/advocate/articleEditorAtoms";
import {
    ArticleBlock,
    ArticleBlockTypes,
} from "../../../../types/article.types";
import { RawRefLinks } from "../../../../types/advocate/article.types";

export interface ContentErrors {
    title: string | null;
    content: string | null;
    refLinks: string | null;
}

export interface AppendUrlState {
    text: string;
    error: string | null;
}

interface ArticleEditorProps {
    articleId?: string;
    initialTitle?: string;
    initialContent?: string[];
    initialRefLinks?: RawRefLinks[];
    blockStyles: ArticleBlockTypes[];
    setBlockStyles: (
        fn: (cur: ArticleBlockTypes[]) => ArticleBlockTypes[]
    ) => void;
    focusSelection: (val: number) => void;
    blurSelection: () => void;
}

const ArticleEditor = ({
    articleId,
    initialTitle,
    initialContent,
    initialRefLinks,
    blockStyles,
    setBlockStyles,
    focusSelection,
    blurSelection,
}: ArticleEditorProps) => {
    const router = useRouter();

    const [titleText, setTitleText] = useState<string>(
        initialTitle ? initialTitle : ""
    );
    const [articleContent, setArticleContent] = useState<string[]>(
        initialContent ? initialContent : []
    );
    const [referencesLinks, setReferenceLinks] = useState<RawRefLinks[]>(
        initialRefLinks ? initialRefLinks : []
    );
    const [articleProperties, setArticleProperties] = useRecoilState(
        articlePropertiesAtom
    );

    const [addRefLinkInput, setAddRefLinkInput] = useState<AppendUrlState>({
        text: "",
        error: null,
    });

    const [contentErrors, setContentErrors] = useState<ContentErrors>({
        title: null,
        content: null,
        refLinks: null,
    });

    const updateArticleMutation = trpc.useMutation(
        ["advocate.articles.upsertArticle"],
        {
            onSuccess: (data) => {
                showNotification({
                    title: "更新成功",
                    message: "我們正在為您重整資料",
                });
                if (data.id !== articleId)
                    router.push(`/advocate/issues/${data.id}`);
                else router.reload();
            },
            onError: () => {
                showNotification({
                    color: "red",
                    title: "發生錯誤",
                    message: "發生錯誤，請再試一次",
                    autoClose: false,
                });
            },
        }
    );

    const submitData = () => {
        const dataErrors = checkArticleData({
            title: titleText,
            brief: articleProperties.brief,
            tags: articleProperties.tags,
            content: articleContent,
            refLinks: referencesLinks,
        });

        if (dataErrors) {
            setContentErrors({
                title: dataErrors.title,
                content: dataErrors.content,
                refLinks: dataErrors.refLinks,
            });
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    brief: dataErrors.brief,
                    tags: dataErrors.tags,
                },
            }));
            return;
        }

        updateArticleMutation.mutate({
            id: articleId,
            title: titleText,
            brief: articleProperties.brief,
            content: articleContent.map(
                (block, i) =>
                    ({
                        type: blockStyles[i] as ArticleBlockTypes,
                        content: block,
                    } as ArticleBlock)
            ),
            tags: articleProperties.tags,
            references: referencesLinks.map((link) => link.url),
        });
    };

    const updateReferenceLinks = () => {
        referencesLinks.forEach((link) => {
            if (link.status !== "queued") return;
            setReferenceLinks((curLinks) =>
                curLinks.map((curLink) =>
                    curLink.url === link.url
                        ? {
                              ...curLink,
                              status: "loading",
                          }
                        : curLink
                )
            );
            fetch("/api/utils/previewlink/", {
                method: "POST",
                body: JSON.stringify({
                    link: link.url,
                }),
            })
                .then(async (res) => {
                    if (!res.ok)
                        throw new Error(
                            res.status === 404 ? "not_found" : "unknown"
                        );
                    const data = await res.json();
                    setReferenceLinks((curLinks) =>
                        curLinks.map((ftrLink) =>
                            ftrLink.url === link.url
                                ? {
                                      data: data,
                                      status: "fetched",
                                      url: ftrLink.url,
                                  }
                                : ftrLink
                        )
                    );
                })
                .catch((err) => {
                    if (err.message === "not_found")
                        setReferenceLinks((curLinks) =>
                            curLinks.map((ftrLink) =>
                                ftrLink.url === link.url
                                    ? {
                                          data: null,
                                          status: "not_found",
                                          url: ftrLink.url,
                                      }
                                    : ftrLink
                            )
                        );
                    else
                        showNotification({
                            color: "red",
                            title: "發生錯誤",
                            message: "於預覽連結時發生錯誤，請檢查連結是否正確",
                        });
                });
        });
    };

    useEffect(() => {
        updateReferenceLinks();
    }, [referencesLinks]);

    return (
        <div className="relative w-full pb-20">
            <LoadingOverlay visible={updateArticleMutation.isLoading} />
            <TextInput
                classNames={{
                    input: "text-3xl font-bold",
                }}
                placeholder="議題標題"
                variant="unstyled"
                size="xl"
                value={titleText}
                onChange={(e) => {
                    setTitleText(e.currentTarget.value);
                    setContentErrors((cur) => ({
                        ...cur,
                        title: null,
                    }));
                }}
                error={contentErrors.title}
            />
            <ArticleContent
                articleContent={articleContent}
                setArticleContent={setArticleContent}
                blockStyles={blockStyles}
                focusSelection={focusSelection}
                blurSelection={blurSelection}
                setBlockStyles={setBlockStyles}
                contentErrors={contentErrors}
            />
            <div className="my-4 w-full border-b border-b-slate-400" />
            <ArticleReferences
                referencesLinks={referencesLinks}
                setReferenceLinks={setReferenceLinks}
                addRefLinkInput={addRefLinkInput}
                setAddRefLinkInput={setAddRefLinkInput}
                contentErrors={contentErrors}
            />
            <Button className="mt-6" variant="outline" onClick={submitData}>
                發布
            </Button>
        </div>
    );
};

export default ArticleEditor;
