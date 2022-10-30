import {
    ArrowCircleUpIcon,
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from "@heroicons/react/outline";
import { Button } from "@mantine/core";

interface PageProps {
    prevPage?: () => void;
    nextPage?: () => void;
}

const Comments = ({ prevPage, nextPage }: PageProps) => {
    return (
        <div className="relative h-full w-full pb-12">
            <div className="h-full w-full overflow-y-auto scrollbar-hide">
                <h1 className="text-5xl font-bold text-primary-700">
                    留言介紹
                </h1>
                <p className="mt-14 align-middle text-2xl leading-9 text-neutral-700">
                    Speakup的留言回覆中，有個特別的按鈕
                    <ArrowCircleUpIcon className="mx-2 my-2 inline w-6" />{" "}
                    <br />
                    這個按鈕代表的意義是「我不認同你的立場，但是我認為你講得有道理」
                    <br />
                    我們鼓勵各位多多使用這個按鈕鼓勵不同立場的使用者！
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
                    下一頁
                    <ArrowNarrowRightIcon className="ml-2 inline h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default Comments;
