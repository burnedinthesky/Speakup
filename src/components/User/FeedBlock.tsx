import { forwardRef } from "react";
import { FeedArgument, FeedArticle, FeedComment } from "../../types/user.types";

interface FeedBlockProps {
    data: FeedArgument | FeedComment | FeedArticle;
}

const FeedBlock = forwardRef<HTMLDivElement, FeedBlockProps>(
    ({ data }, ref) => {
        return (
            <div className="w-full rounded-lg bg-white px-6 py-4" ref={ref}>
                {data.feedType === "argument" ? (
                    <p className="text-sm text-neutral-600">
                        論點・{data.articleTitle}
                    </p>
                ) : data.feedType === "comment" ? (
                    <p className="text-sm text-neutral-600">
                        回覆論點・{data.articleTitle}
                    </p>
                ) : undefined}
                {data.feedType === "argument" && (
                    <p className="mt-2 text-neutral-700">{data.content}</p>
                )}
                {data.feedType === "comment" && (
                    <div>
                        <div className="my-1 grid grid-cols-[4px,1fr] items-center gap-x-3">
                            <div className="mx-2 h-4/6 border-l-2 border-l-neutral-500" />
                            <p className="text-neutral-600">
                                {data.argumentContent}
                            </p>
                        </div>
                        <p className="text-neutral-800">{data.content}</p>
                    </div>
                )}
                {data.feedType === "article" && (
                    <p className="mt-2 text-neutral-700">發布了{data.title}</p>
                )}
            </div>
        );
    }
);

FeedBlock.displayName = "FeedBlock";

export default FeedBlock;
