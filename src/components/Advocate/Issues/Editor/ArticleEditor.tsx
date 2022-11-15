import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

import {
    ActionIcon,
    Button,
    LoadingOverlay,
    Textarea,
    TextInput,
} from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import { articlePropertiesAtom } from "../../../../atoms/advocate/articleEditorAtoms";
import {
    ArticleBlock,
    ArticleBlockTypes,
    ReferencesLink,
} from "../../../../types/article.types";
import ReferenceCard from "../../../Discussion/Article/ReferenceCard";

const TypeToSize = {
    h1: "text-2xl",
    h2: "text-xl",
    h3: "text-lg",
    p: "text-base",
    spoiler: "text-base",
};

function isValidHttpUrl(url: string) {
    try {
        new URL(url);
    } catch (_) {
        return false;
    }
    return true;
}

interface Errors {
    title: string | null;
    content: string | null;
    refLinks: string | null;
}

interface AppendUrlState {
    text: string;
    error: string | null;
}

interface RawRefLinks {
    status: "queued" | "loading" | "fetched" | "not_found";
    data: ReferencesLink | null;
    url: string;
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
    focusBlock: (val: number) => void;
    blurSelection: () => void;
}

const ArticleEditor = ({
    articleId,
    initialTitle,
    initialContent,
    initialRefLinks,
    blockStyles,
    setBlockStyles,
    focusBlock,
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

    const [errors, setErrors] = useState<Errors>({
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
        let passed = 0;

        if (titleText.length == 0)
            setErrors((cur) => ({ ...cur, title: "請輸入標題" }));
        else if (titleText.length > 32)
            setErrors((cur) => ({
                ...cur,
                title: "標題過長，請縮短至三十二個字",
            }));
        else {
            setErrors((cur) => ({
                ...cur,
                title: null,
            }));
            passed++;
        }

        if (articleContent.some((block) => block.length <= 0))
            setErrors((cur) => ({ ...cur, content: "請確認每格議題均有文字" }));
        else if (articleContent.length < 4)
            setErrors((cur) => ({ ...cur, content: "議題過短" }));
        else {
            setErrors((cur) => ({
                ...cur,
                content: null,
            }));
            passed++;
        }

        if (articleProperties.tags.length < 1) {
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    ...cur.errors,
                    tags: "請選擇至少一個標籤",
                },
            }));
        } else {
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    ...cur.errors,
                    tags: null,
                },
            }));
            passed++;
        }

        if (articleProperties.brief.length < 10) {
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    ...cur.errors,
                    brief: "簡介過短，請輸入至少十個字",
                },
            }));
        } else if (articleProperties.brief.length > 60) {
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    ...cur.errors,
                    brief: "簡介過長，請輸入至多六十個字",
                },
            }));
        } else {
            setArticleProperties((cur) => ({
                ...cur,
                errors: {
                    ...cur.errors,
                    brief: null,
                },
            }));
            passed++;
        }

        if (referencesLinks.length < 2) {
            setErrors((cur) => ({ ...cur, refLinks: "請參考至少兩篇資料" }));
        } else {
            setErrors((cur) => ({ ...cur, refLinks: null }));
            passed++;
        }

        if (passed < 5) return;

        console.log(referencesLinks);

        const refUrls: string[] = referencesLinks.map((link) => link.url);

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
            references: refUrls,
        });
    };

    const updateReferenceLinks = () => {
        referencesLinks.forEach((link) => {
            if (link.status === "queued") {
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
                                message:
                                    "於預覽連結時發生錯誤，請檢查連結是否正確",
                            });
                    });
            }
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
                    setErrors((cur) => ({
                        ...cur,
                        title: null,
                    }));
                }}
                error={errors.title}
            />
            <div className="mt-4 flex w-full flex-col ">
                <h3 className="mb-2 text-2xl font-semibold">議題內文</h3>
                {errors.content && (
                    <p className="text-sm text-red-500">{errors.content}</p>
                )}
                {articleContent.map((block, i) => (
                    <div
                        key={i}
                        className="group flex w-full items-center gap-2"
                    >
                        <Textarea
                            value={block}
                            onChange={(e) => {
                                let updateString = e.currentTarget.value;
                                updateString = updateString.replaceAll(
                                    "\n",
                                    ""
                                );
                                setArticleContent((cur) =>
                                    cur.map((block, j) =>
                                        j === i ? updateString : block
                                    )
                                );
                            }}
                            autosize
                            className="flex-grow"
                            classNames={{
                                input: `${
                                    TypeToSize[
                                        blockStyles[i] as ArticleBlockTypes
                                    ]
                                } w-full`,
                            }}
                            onFocus={() => {
                                focusBlock(i);
                            }}
                            onBlur={() => {
                                blurSelection();
                            }}
                            variant="unstyled"
                            placeholder="新增段落"
                        />
                        <ActionIcon
                            className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            onClick={() => {
                                setArticleContent((cur) =>
                                    cur.filter((_, j) => j !== i)
                                );
                                setBlockStyles((cur) =>
                                    cur.filter((_, j) => j !== i)
                                );
                            }}
                        >
                            <TrashIcon className="w-4 text-slate-500" />
                        </ActionIcon>
                    </div>
                ))}

                <button
                    className={`flex h-8 w-full items-center text-slate-500 ${
                        articleContent.length === 0 ? "opacity-60" : "opacity-0"
                    } transition-opacity disabled:invisible hover:opacity-60`}
                    disabled={
                        articleContent.length >= 1 &&
                        articleContent[articleContent.length - 1]?.length === 0
                    }
                    onClick={() => {
                        setArticleContent((cur) => [...cur, ""]);
                        setBlockStyles((cur) => [...cur, "p"]);
                    }}
                >
                    <div className="flex-grow border-t border-t-slate-500"></div>
                    <div className="mx-4 flex items-center gap-2 ">
                        <PlusIcon className="w-4" />
                        <p className="text-sm">新增段落</p>
                    </div>
                    <div className="flex-grow border-t border-t-slate-500"></div>
                </button>
            </div>
            <div className="my-4 w-full border-b border-b-slate-400" />
            <div className="w-full">
                <h3 className="text-2xl font-semibold">參考資料</h3>
                {errors.refLinks && (
                    <p className="text-red-500">{errors.refLinks}</p>
                )}
                <div className="mt-4 flex w-full flex-col gap-4">
                    {referencesLinks.map((link, i) => {
                        return (
                            <div
                                key={i}
                                className="flex w-full items-center gap-2"
                            >
                                {link.data ? (
                                    <ReferenceCard data={link.data} />
                                ) : link.status === "not_found" ? (
                                    <p className="text-red-500">
                                        預覽失敗（404） {link.url}
                                    </p>
                                ) : (
                                    <p className="text-slate-500">{link.url}</p>
                                )}
                                <ActionIcon
                                    onClick={() => {
                                        setReferenceLinks((cur) =>
                                            cur.filter(
                                                (mapLink) =>
                                                    mapLink.url !== link.url
                                            )
                                        );
                                    }}
                                >
                                    <TrashIcon className="w-4" />
                                </ActionIcon>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-2 flex w-full items-center gap-2">
                    <TextInput
                        className="flex-grow "
                        classNames={{ input: "text-slate-500" }}
                        variant="unstyled"
                        placeholder="新增連結"
                        value={addRefLinkInput.text}
                        onChange={(e) => {
                            const url = e.currentTarget.value;
                            setAddRefLinkInput((cur) => ({
                                ...cur,
                                text: url,
                                error: null,
                            }));
                        }}
                        error={addRefLinkInput.error}
                    />
                    <ActionIcon
                        onClick={() => {
                            if (!isValidHttpUrl(addRefLinkInput.text))
                                setAddRefLinkInput((cur) => ({
                                    ...cur,
                                    error: "請輸入格式正確的URL",
                                }));
                            else if (
                                referencesLinks.some(
                                    (link) => link.url === addRefLinkInput.text
                                )
                            )
                                setAddRefLinkInput((cur) => ({
                                    ...cur,
                                    error: "已將本網址加入參考資料",
                                }));
                            else {
                                setReferenceLinks((cur) => [
                                    ...cur,
                                    {
                                        data: null,
                                        status: "queued",
                                        url: addRefLinkInput.text,
                                    },
                                ]);
                                setAddRefLinkInput({ text: "", error: null });
                            }
                        }}
                    >
                        <PlusIcon className="w-4" />
                    </ActionIcon>
                </div>
            </div>
            <Button className="mt-6" variant="outline" onClick={submitData}>
                發布
            </Button>
        </div>
    );
};

export default ArticleEditor;
