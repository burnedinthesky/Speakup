import Link from "next/link";
import { Avatar } from "@mantine/core";

import type { Article } from "../../../types/article.types";
import ArticleInteractions from "./ArticleInteractions";
import ArticleBlock from "./ArticleBlock";
import { useSession } from "next-auth/react";

interface ArticleViewerProps {
    article: Article;
}

const ArticleViewer = ({ article }: ArticleViewerProps) => {
    const { data: session } = useSession();

    return (
        <div>
            <div className="mx-auto w-full bg-neutral-50 py-6 px-9">
                <h1 className="pb-2 text-3xl text-primary-900">
                    {article.title}
                </h1>
                <div className="flex items-center gap-2 pb-3">
                    <Avatar
                        src={article.author.profileImg}
                        radius="xl"
                        size="sm"
                    >
                        {article.author.name[0]}
                    </Avatar>
                    <p className="text-sm text-neutral-500">
                        {article.author.name}
                    </p>
                    <div className="w-4" />
                </div>
                <div className="flex flex-wrap justify-start gap-4">
                    {article.tags.map((tag, i) =>
                        session ? (
                            <Link href={`/search/results?tags=${tag}`} key={i}>
                                <div className="flex h-8 flex-shrink-0 cursor-pointer items-center rounded-2xl border-[1.5px] border-neutral-400 px-4">
                                    <p className="text-center text-sm text-neutral-500">{`#${tag}`}</p>
                                </div>
                            </Link>
                        ) : (
                            <div
                                className="flex h-8 flex-shrink-0 items-center rounded-2xl border-[1.5px] border-neutral-400 px-4"
                                key={i}
                            >
                                <p className="text-center text-sm text-neutral-500">{`#${tag}`}</p>
                            </div>
                        )
                    )}
                </div>
                <article className="mt-6 flex flex-col gap-4 text-neutral-700">
                    {article.content.map((contentBlock, i) => (
                        <ArticleBlock key={i} {...contentBlock} />
                    ))}
                </article>
                <div className="mt-6 flex flex-col gap-2 text-neutral-700">
                    <h2 className="text-2xl text-primary-800">延伸閱讀</h2>
                    {article.references.map((readLink, i) => (
                        <a
                            href={readLink.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={i}
                        >
                            <p>{readLink.title}</p>
                        </a>
                    ))}
                </div>
                {session && (
                    <>
                        <hr className="my-5 border-neutral-700" />
                        <ArticleInteractions articleId={article.id} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticleViewer;
