import {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { Button } from "@mantine/core";

interface PageProps {
    prevPage?: () => void;
    nextPage?: () => void;
}

const Introduction = ({ prevPage, nextPage }: PageProps) => {
    return (
        <div className="relative h-full w-full pb-12">
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                <h1 className="text-5xl font-bold text-primary-700">
                    歡迎來到Speakup
                </h1>
                <p className="mt-14 text-2xl text-neutral-700">
                    Speakup是專門為了理性交流、深度討論時事所設計的平台
                    <br />
                    <br />
                    因此，Speakup將會與您所使用過的社群媒體平台有些許不同
                    <br />
                    <br />
                    讓我們帶您了解Speakup！
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
                >
                    開始
                    <ArrowNarrowRightIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default Introduction;
