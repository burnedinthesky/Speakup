import useUpsertCollectionMutation from "../../../hooks/navigation/useUpsertCollectionMutation";

import { Checkbox, Overlay, ScrollArea } from "@mantine/core";
import { PlusCircleIcon } from "@heroicons/react/outline";

import { CollectionSet } from "../../../schema/navigation.schema";

interface ColSetCardProps {
    checked: boolean;
    name: string;
    setChecked: (value: boolean) => void;
}

const ColSetCard = ({ checked, name, setChecked }: ColSetCardProps) => {
    return (
        <div className=" flex w-full items-center gap-2">
            <Checkbox
                size="sm"
                checked={checked}
                onChange={(e) => {
                    setChecked(e.currentTarget.checked);
                }}
            />
            <p className="text-sm">{name}</p>
        </div>
    );
};

interface ColSetSelectorProps {
    articleId: string;
    data?: {
        collectionSets: number[];
        id: number;
    } | null;
    colSets?: CollectionSet[];
    selectedSets: number[];
    setOpenCreateColSelModal: (value: boolean) => void;
}

const ColSetSelector = ({
    articleId,
    data,
    colSets,
    selectedSets,
    setOpenCreateColSelModal,
}: ColSetSelectorProps) => {
    const upsertCollectionMutation = useUpsertCollectionMutation();

    return (
        <ScrollArea.Autosize maxHeight={256}>
            <div className="relative flex w-full flex-col gap-2">
                {!data && <Overlay />}
                {colSets?.map((set, i) => (
                    <ColSetCard
                        key={i}
                        checked={selectedSets.includes(set.id)}
                        name={set.name}
                        setChecked={(val) => {
                            if (val && !selectedSets.includes(set.id)) {
                                upsertCollectionMutation.mutate({
                                    articleId: articleId,
                                    collectionSetIds: [...selectedSets, set.id],
                                });
                            } else if (!val && selectedSets.includes(set.id)) {
                                console.log("Here");
                                upsertCollectionMutation.mutate({
                                    articleId: articleId,
                                    collectionSetIds: [
                                        ...selectedSets.filter(
                                            (ele) => ele !== set.id
                                        ),
                                    ],
                                });
                            }
                        }}
                    />
                ))}
                <button
                    className="mt-2 flex items-center"
                    onClick={() => {
                        setOpenCreateColSelModal(true);
                    }}
                >
                    <PlusCircleIcon className="mr-2 h-4" />
                    <p className="text-sm">新增收藏集</p>
                </button>
            </div>
        </ScrollArea.Autosize>
    );
};
export default ColSetSelector;
