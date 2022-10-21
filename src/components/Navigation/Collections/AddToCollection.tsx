import { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";

import { LoadingOverlay, Popover } from "@mantine/core";
import { BookmarkIcon, PlusIcon, XIcon } from "@heroicons/react/outline";

import ColSetSelector from "./ColSetSelector";
import useUpsertCollectionMutation from "../../../hooks/navigation/useUpsertCollectionMutation";
import useDeleteCollectionMutation from "../../../hooks/navigation/useDeleteCollectionMutation";
import CreateColSetModal from "./CreateCollectionsSetModal";
import MobileDrawer from "../../../common/components/Overlays/MobileDrawer";
import useScreenSize from "../../../common/hooks/useScreenSize";

interface Styles {
    bookmarkIcon?: string;
    collectText?: string;
}

interface AddToCollectionProps {
    articleId: string;
    classNames?: Styles;
}

const AddToCollection = ({ articleId, classNames }: AddToCollectionProps) => {
    const [openSelectingContent, setOpenSelectingContent] =
        useState<boolean>(false);
    const [selectedSets, setSelectedSets] = useState<number[]>([]);
    const [openCreateColSetModal, setOpenCreateColSelModal] =
        useState<boolean>(false);

    const screenWidth = useScreenSize();

    const { data, isLoading } = trpc.useQuery([
        "navigation.getSingleCollection",
        { articleId: articleId },
    ]);

    const { data: colSets, isLoading: isColSetsLoading } = trpc.useQuery([
        "navigation.getCollectionSets",
    ]);

    const upsertCollectionMutation = useUpsertCollectionMutation();
    const deleteCollectionMutation = useDeleteCollectionMutation();

    useEffect(() => {
        if (!colSets || !data) {
            setSelectedSets([]);
        } else {
            let newColSets: number[] = [];
            colSets.forEach((ele) => {
                if (data.collectionSets.includes(ele.id)) {
                    newColSets.push(ele.id);
                }
            });
            setSelectedSets(newColSets);
        }
    }, [colSets, data]);

    const isSelected: boolean = data ? true : false;

    const SelectingContent = () => {
        return (
            <div className="relative w-full text-primary-700">
                <LoadingOverlay visible={isLoading || isColSetsLoading} />
                <div className="flex w-full justify-end">
                    {isSelected ? (
                        <button
                            className="flex items-center"
                            onClick={() => {
                                if (!data)
                                    throw new Error("Collection is null");
                                deleteCollectionMutation.mutate({
                                    collectionId: data.id,
                                });
                            }}
                        >
                            <XIcon className="mr-2 inline h-4" />
                            <p className="inline text-sm">移除</p>
                        </button>
                    ) : (
                        <button
                            className="flex items-center"
                            onClick={() => {
                                upsertCollectionMutation.mutate({
                                    articleId: articleId,
                                    collectionSetIds: [],
                                });
                            }}
                        >
                            <PlusIcon className="mr-2 inline h-4" />
                            <p className="inline text-sm">收藏</p>
                        </button>
                    )}
                </div>
                <hr className="my-2 text-neutral-600" />
                <ColSetSelector
                    articleId={articleId}
                    data={data}
                    colSets={colSets}
                    selectedSets={selectedSets}
                    setOpenCreateColSelModal={setOpenCreateColSelModal}
                />
            </div>
        );
    };

    return (
        <>
            <Popover
                classNames={{ dropdown: "w-64 hidden lg:block" }}
                opened={openSelectingContent}
                onChange={setOpenSelectingContent}
            >
                <Popover.Target>
                    <button
                        className="flex flex-shrink-0 items-center"
                        onClick={() => {
                            setOpenSelectingContent((cur) => !cur);
                        }}
                    >
                        <BookmarkIcon className={classNames?.bookmarkIcon} />
                        <p className={classNames?.collectText}>
                            {isSelected ? "已收藏" : "收藏"}
                        </p>
                    </button>
                </Popover.Target>
                <MobileDrawer
                    opened={screenWidth < 1024 && openSelectingContent}
                    onClose={() => {
                        setOpenSelectingContent(false);
                    }}
                >
                    <SelectingContent />
                </MobileDrawer>
                <Popover.Dropdown>
                    <SelectingContent />
                </Popover.Dropdown>
            </Popover>
            <CreateColSetModal
                opened={openCreateColSetModal}
                setOpened={setOpenCreateColSelModal}
            />
        </>
    );
};

export default AddToCollection;