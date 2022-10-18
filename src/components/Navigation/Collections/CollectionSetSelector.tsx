import { useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import CreateColSetModal from "./CreateCollectionsSetModal";
import { CollectionSet } from "../../../schema/navigation.schema";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

interface CollectionSetSelectorProps {
    sets: {
        id: number;
        name: string;
    }[];
    selectedSet: number | null;
    setSelectedSet: (value: number | null) => void;
}

const CollectionSetSelector = ({
    sets,
    selectedSet,
    setSelectedSet,
}: CollectionSetSelectorProps) => {
    const [openAddSetModal, setOpenAddSetModal] = useState<boolean>(false);
    const [excludedSets, setExcludedSets] = useState<number[]>([]);

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

    const CollectionSetCard = ({ set }: { set: CollectionSet }) => {
        return (
            <div
                className={` group flex w-full items-center justify-between underline-offset-4`}
            >
                <button
                    className={`${selectedSet === set.id ? "underline" : ""}`}
                    onClick={() => {
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

    return (
        <div className=" fixed top-[136px] right-14 max-h-[calc(100vh-216px)] w-64 overflow-y-auto rounded-lg bg-white py-5 px-6 text-primary-800">
            <h2 className="text-xl">您的收藏</h2>
            <div className="mt-5 flex flex-col items-start gap-2 text-lg">
                {sets
                    .filter((ele) => !excludedSets.includes(ele.id))
                    .map((set, i) => (
                        <CollectionSetCard key={i} set={set} />
                    ))}
                <button
                    className="mt-2 flex items-center"
                    onClick={() => {
                        setOpenAddSetModal(true);
                    }}
                >
                    <PlusCircleIcon className="mr-2 h-6" />
                    <p>新增收藏集</p>
                </button>
            </div>
            <CreateColSetModal
                opened={openAddSetModal}
                setOpened={setOpenAddSetModal}
            />
        </div>
    );
};

export default CollectionSetSelector;
