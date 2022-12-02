import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { trpc } from "../../utils/trpc";
import FeedBlock from "./FeedBlock";
import FeedBlockLoading from "./FeedBlockLoading";

interface UserFeedProps {
    userId: string;
    userName: string;
}

const UserFeed = ({ userId, userName }: UserFeedProps) => {
    const { data, fetchNextPage, hasNextPage, isFetching } =
        trpc.users.userFeed.useInfiniteQuery(
            {
                userId: userId,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    const { inView, ref } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <div className="w-full">
            <h3 className="mt-8 text-center text-lg text-neutral-700">
                {userName}的動態
            </h3>
            {data && (
                <div className="mt-4 flex flex-col gap-3">
                    {data.pages
                        .flatMap((page) => page.data)
                        .map((feed, i, arr) => (
                            <FeedBlock
                                key={i}
                                data={feed}
                                ref={i === arr.length - 1 ? ref : undefined}
                            />
                        ))}
                </div>
            )}
            <div className="mt-4">{isFetching && <FeedBlockLoading />}</div>
        </div>
    );
};

export default UserFeed;
