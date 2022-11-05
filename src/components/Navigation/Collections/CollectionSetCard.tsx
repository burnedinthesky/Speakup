import { TrashIcon } from "@heroicons/react/outline";
import { showNotification } from "@mantine/notifications";
import { CollectionSet } from "../../../types/navigation.types";
import { trpc } from "../../../utils/trpc";

interface CollectionSetCardProps {
    set: CollectionSet;
    selectedSet: number | null;
    setSelectedSet: (value: number | null) => void;
    setExcludedSets: (fn: (cur: number[]) => number[]) => void;
    setMobileDrawerOpened: (opened: boolean) => void;
}

const CollectionSetCard = ({
    set,
    selectedSet,
    setSelectedSet,
    setExcludedSets,
    setMobileDrawerOpened,
}: CollectionSetCardProps) => {
    const trpcUtils = trpc.useContext();

    const deleteColSetMutation = trpc.useMutation(
        ["navigation.deleteCollectionSet"],
        {
            onSettled: (_, error, variables) => {
                if (error) {
                    showNotification({
                        title: "發生錯誤",
                        message: "收藏集刪除失敗",
                        color: "red",
                    });
                    setExcludedSets((cur) =>
                        cur.filter((ele) => ele !== variables.colSetId)
                    );
                }
                trpcUtils.invalidateQueries("navigation.getCollectionSets");
            },
            onMutate: (variables) => {
                setExcludedSets((cur) => [...cur, variables.colSetId]);
            },
        }
    );

    return (
        <div
            className={`group flex w-full items-center justify-between underline-offset-4`}
        >
            <button
                className={`${selectedSet === set.id ? "underline" : ""}`}
                onClick={() => {
                    setMobileDrawerOpened(false);
                    setSelectedSet(selectedSet === set.id ? null : set.id);
                }}
            >
                {set.name}
            </button>
            <button
                className="hidden group-hover:block"
                onClick={() => {
                    deleteColSetMutation.mutate({ colSetId: set.id });
                }}
            >
                <TrashIcon className="h-5 " />
            </button>
        </div>
    );
};

export default CollectionSetCard;
