import { useState } from "react";
import {
    ChevronUpIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/outline";
import CreateColSetModal from "./CreateCollectionsSetModal";
import { CollectionSet } from "../../../types/navigation.types";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import MobileDrawer from "../../../common/components/Overlays/MobileDrawer";

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

    const [mobileDrawerOpened, setMobileDrawerOpened] =
        useState<boolean>(false);

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

    return (
        <>
            <div className="block xl:hidden">
                <div className="fixed bottom-12 left-0 z-10 flex h-10 w-screen items-center justify-center bg-neutral-100 lg:bottom-0 lg:pl-64">
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            setMobileDrawerOpened(true);
                        }}
                    >
                        <ChevronUpIcon className="h-6 w-6 text-primary-700" />
                    </button>
                </div>
                <MobileDrawer
                    opened={mobileDrawerOpened}
                    onClose={() => {
                        setMobileDrawerOpened(false);
                    }}
                >
                    <>
                        <h2 className="text-xl text-primary-800">選擇收藏集</h2>
                        <div className="mt-5 flex flex-col items-start gap-2 text-lg text-primary-800">
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
                    </>
                </MobileDrawer>
            </div>
            <div className="fixed top-[136px] right-6 hidden max-h-[calc(100vh-216px)] w-56 overflow-y-auto rounded-lg bg-white py-5 px-6 text-primary-800 xl:block 2xl:right-14 2xl:w-64">
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
        </>
    );
};

export default CollectionSetSelector;
