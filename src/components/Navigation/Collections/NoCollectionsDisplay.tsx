import { BookmarkIcon } from "@heroicons/react/outline";

const NoCollectionsDisplay = () => {
    return (
        <div className="mx-auto items-center text-center text-2xl text-primary-800">
            <BookmarkIcon className="mx-auto h-32 w-32" />
            <p className="mt-2">您目前還沒有收藏</p>
            <p className="mt-2 text-2xl">點擊書籤圖示即可將一個議題收藏起來</p>
        </div>
    );
};

export default NoCollectionsDisplay;
