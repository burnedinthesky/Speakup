import { ChevronDownIcon } from "@heroicons/react/outline";
import { Loader } from "@mantine/core";

interface ShowRepliesButtonProps {
    fetchReplies: () => void;
    isLoading: boolean;
}

export function ShowRepliesButton({
    fetchReplies,
    isLoading,
}: ShowRepliesButtonProps) {
    return (
        <button
            className="flex items-start gap-1 text-neutral-500"
            onClick={() => {
                fetchReplies();
            }}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="flex items-center">
                    <Loader className="h-4" />
                    <p className="inline text-sm">載入中</p>
                </div>
            ) : (
                <div className="flex items-center">
                    <ChevronDownIcon className="inline h-5 w-5 " />
                    <p className="inline text-sm">顯示回覆</p>
                </div>
            )}
        </button>
    );
}
