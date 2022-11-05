import { BookmarkIcon } from "@heroicons/react/outline";

const NoCollectionsDisplay = () => {
    return (
        <div className="mx-auto items-center text-center text-lg text-primary-800 lg:text-2xl">
            <BookmarkIcon className="mx-auto h-16 w-16 lg:h-32 lg:w-32 " />
            <p className="mt-2">
                您目前還沒有收藏 <br />
                點擊書籤圖示即可收藏一個議題
            </p>
        </div>
    );
};

export default NoCollectionsDisplay;
