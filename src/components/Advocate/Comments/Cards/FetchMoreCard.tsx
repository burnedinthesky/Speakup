import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";

const FetchMoreCard = ({ fetchMore }: { fetchMore: () => void }) => {
    return (
        <button
            className="flex min-h-[208px] w-full flex-col
                            items-center justify-center gap-2
                            rounded-md border border-slate-100 p-3 text-slate-500 shadow-sm"
            onClick={fetchMore}
        >
            <p>載入更多</p>
            <DotsCircleHorizontalIcon className="w-6" />
        </button>
    );
};

export default FetchMoreCard;
