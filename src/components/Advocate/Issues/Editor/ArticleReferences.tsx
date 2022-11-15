import { ActionIcon, TextInput } from "@mantine/core";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

import ReferenceCard from "../../../Discussion/Article/ReferenceCard";

import type { AppendUrlState, ContentErrors } from "./ArticleEditor";
import type { RawRefLinks } from "../../../../types/advocate/article.types";

function isValidHttpUrl(url: string) {
    try {
        new URL(url);
    } catch (_) {
        return false;
    }
    return true;
}

interface ArticleReferencesProps {
    referencesLinks: RawRefLinks[];
    setReferenceLinks: (fn: (cur: RawRefLinks[]) => RawRefLinks[]) => void;
    contentErrors: ContentErrors;
    addRefLinkInput: AppendUrlState;
    setAddRefLinkInput: (fn: (cur: AppendUrlState) => AppendUrlState) => void;
}

const ArticleReferences = ({
    referencesLinks,
    setReferenceLinks,
    contentErrors,
    addRefLinkInput,
    setAddRefLinkInput,
}: ArticleReferencesProps) => {
    return (
        <div className="w-full">
            <h3 className="text-2xl font-semibold">參考資料</h3>
            {contentErrors.refLinks && (
                <p className="text-red-500">{contentErrors.refLinks}</p>
            )}
            <div className="mt-4 flex w-full flex-col gap-4">
                {referencesLinks.map((link, i) => {
                    return (
                        <div key={i} className="flex w-full items-center gap-2">
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
                    classNames={{
                        input: "text-slate-500",
                    }}
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
                            setAddRefLinkInput((cur) => ({
                                text: "",
                                error: null,
                            }));
                        }
                    }}
                >
                    <PlusIcon className="w-4" />
                </ActionIcon>
            </div>
        </div>
    );
};

export default ArticleReferences;
