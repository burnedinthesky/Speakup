import {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { Button } from "@mantine/core";

interface PageProps {
    prevPage?: () => void;
    nextPage?: () => void;
    isLoading: boolean;
}

const AllDone = ({ prevPage, nextPage, isLoading }: PageProps) => {
    return (
        <div className="relative h-full w-full pb-12">
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                <h1 className="text-5xl font-bold text-primary-700">
                    即將開始...
                </h1>
                <p className="mt-14 align-middle text-2xl leading-9 text-neutral-700">
                    再次歡迎你來到Speakup，我們期待您有一個絕佳的線上討論體驗！
                </p>
            </div>
            {prevPage && (
                <Button
                    className="absolute left-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={prevPage}
                >
                    上一頁
                    <ArrowNarrowLeftIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
            {nextPage && (
                <Button
                    className="absolute right-0 bottom-0 h-11 bg-primary-600"
                    classNames={{ root: "px-3" }}
                    onClick={nextPage}
                    loading={isLoading}
                >
                    開始使用Speakup
                    <ArrowNarrowRightIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default AllDone;
