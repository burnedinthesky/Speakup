import React, { useState } from "react";
import Link from "next/link";
import { Spoiler } from "@mantine/core";

import { BookmarkIcon, FlagIcon, ShareIcon } from "@heroicons/react/outline";
import { Article, ArticleBlock } from "../../types/issueTypes";

interface ArticleViewerProps {
    article: Article;
}

const ArticleBlock = ({ type, content, spoilerTitle }: ArticleBlock) => {
    const textSize =
        type === "h1"
            ? "text-2xl text-primary-800"
            : type === "h2"
            ? "text-xl text-primary-800"
            : type === "h3"
            ? "text-lg text-primary-800"
            : "text-base";
    if (type === "spoiler")
        return (
            <Spoiler
                maxHeight={0}
                showLabel={`展開${spoilerTitle}`}
                hideLabel={`收合${spoilerTitle}`}
                classNames={{
                    control: "text-xl leading-10 text-primary-800",
                }}
            >
                <p className="mb-2 text-base text-neutral-700">{content}</p>
            </Spoiler>
        );
    return <p className={`${textSize}`}>{content}</p>;
};

const ArticleViewer = ({ article }: ArticleViewerProps) => {
    const [userSaved, setUserSaved] = useState<boolean>(false);
    const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
    const [openReportMenu, setOpenReportMenu] = useState<boolean>(false);

    return (
        <div>
            <div className="mx-auto w-full bg-neutral-50 py-6 px-9">
                <h1 className="pb-2 text-3xl text-primary-900">{article.title}</h1>
                <div className="flex items-center pb-3">
                    <img className="mr-3 h-5 w-5 " src={article.author.pfp} alt="" />
                    <p className="text-sm text-neutral-500">{article.author.username}</p>
                    <div className="w-4" />
                </div>
                <div className="flex flex-wrap justify-start gap-4">
                    {article.tags.map((tag, i) => (
                        <Link href={`/search/results?searchterm=@${tag}`} key={i}>
                            <div className="flex h-8 flex-shrink-0 cursor-pointer items-center rounded-2xl border-[1.5px] border-neutral-400 px-4">
                                <p className="text-center text-sm text-neutral-500">{`#${tag}`}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <article className="mt-6 flex flex-col gap-4 text-neutral-700">
                    {article.content.map((contentBlock, i) => (
                        <ArticleBlock key={i} {...contentBlock} />
                    ))}
                </article>
                <div className="flex flex-col mt-6 gap-2 text-neutral-700">
                    <h2 className="text-primary-800 text-2xl">延伸閱讀</h2>
                    {article.furtherReading.map((readLink, i) => (
                        <a href={readLink.link} target="_blank" rel="noopener noreferrer">
                            <p>{readLink.title}</p>
                        </a>
                    ))}
                </div>
                <hr className="my-5 border-neutral-700" />
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setUserSaved(!userSaved);
                        }}
                    >
                        <BookmarkIcon
                            className={`h-7 w-7 text-primary-700 transition-colors ${userSaved ? "fill-yellow-300" : "fill-white"}`}
                        />
                    </button>
                    <button>
                        <ShareIcon className="h-7 w-7 text-primary-700" />
                    </button>
                    <button>
                        <FlagIcon className="h-7 w-7 text-primary-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleViewer;
