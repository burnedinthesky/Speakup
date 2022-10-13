import { ChevronDownIcon } from "@heroicons/react/outline";

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
            <ChevronDownIcon className="inline h-5 w-5 " />
            <p className="inline text-sm">
                {isLoading ? "載入中" : "檢視討論串"}
            </p>
        </button>
    );
}
