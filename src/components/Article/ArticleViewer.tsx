import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";

import { Avatar } from "@mantine/core";

import ArticleBlock from "./ArticleBlock";
import ArticleInteractions from "./ArticleInteractions";
import ReferenceCard from "./ReferenceCard";
import ReportModal from "../../common/components/Report/ReportModal";

import type { Article, ArticleBlockStyles } from "../../types/article.types";
import { openDisccusionModal } from "../../atoms/discussionModal";

interface ArticleViewerProps {
    article: Article;
    className?: string;
    showInteractions: boolean;
    classNames?: {
        title?: string;
        tags?: string;
        author?: string;
        blockStyles?: ArticleBlockStyles;
    };
}

const ArticleViewer = ({
    article,
    className: rootDivClsName,
    showInteractions,
    classNames,
}: ArticleViewerProps) => {
    const { data: session } = useSession();
    const reportModalData = useRecoilValue(openDisccusionModal);
    const [reportModalKey, setReportModalKey] = useState<number>(0);

    useEffect(() => {
        if (reportModalData.opened === false) {
            setReportModalKey((prev) => prev + 1);
        }
    }, [reportModalData]);

    return (
        <>
            <div
                className={
                    rootDivClsName
                        ? rootDivClsName
                        : `mx-auto w-full bg-neutral-50 py-6 px-9`
                }
            >
                <h1
                    className={`pb-2 ${
                        classNames?.title
                            ? classNames.title
                            : "text-3xl text-primary-900"
                    }`}
                >
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
                    <p className={"text-sm text-neutral-500"}>
                        {article.author.name}
                    </p>
                    <div className="w-4" />
                </div>
                <div className="flex flex-wrap justify-start gap-4">
                    {article.tags.map((tag, i) => (
                        <div
                            className="flex h-8 flex-shrink-0 items-center rounded-2xl border-[1.5px] border-neutral-400 px-4"
                            key={i}
                        >
                            <p className="text-center text-sm text-neutral-500">{`#${tag}`}</p>
                        </div>
                    ))}
                </div>
                <article className="mt-6 flex flex-col gap-4 text-neutral-700">
                    {article.content.map((contentBlock, i) => (
                        <ArticleBlock
                            key={i}
                            {...contentBlock}
                            styles={classNames?.blockStyles}
                        />
                    ))}
                </article>
                <div className="mt-6 flex flex-col gap-2 text-neutral-700">
                    <h2
                        className={
                            classNames?.blockStyles?.h1
                                ? classNames.blockStyles.h1
                                : "text-2xl text-primary-800"
                        }
                    >
                        延伸閱讀
                    </h2>
                    {article.references.map((cardData, i) => (
                        <ReferenceCard data={cardData} key={i} />
                    ))}
                </div>
                {session && showInteractions && (
                    <>
                        <hr className="my-5 border-neutral-700" />
                        <ArticleInteractions articleId={article.id} />
                    </>
                )}
            </div>
            <ReportModal key={reportModalKey} />
        </>
    );
};

export default ArticleViewer;
