import { showNotification } from "@mantine/notifications";
import { CollectionSet } from "../../types/navigation.types";
import { trpc } from "../../utils/trpc";

const useDeleteCollectionMutation = () => {
    const trpcUtils = trpc.useContext();

    const deleteCollectionMutation = trpc.useMutation(
        ["navigation.deleteUserCollection"],
        {
            onSettled(data, error, variables, context) {
                const ctx = context as {
                    prevData: {
                        collectionSets: number[];
                        id: number;
                    } | null;
                    prevSets: CollectionSet[];
                };
                if (error) {
                    trpcUtils.setQueryData(
                        ["navigation.getSingleCollection"],
                        ctx.prevData
                    );
                    trpcUtils.setQueryData(
                        ["navigation.getCollectionSets"],
                        ctx.prevSets
                    );
                    showNotification({
                        title: "發生錯誤",
                        message: "取消收藏失敗，請再試一次",
                        color: "red",
                    });
                }
                trpcUtils.invalidateQueries(["navigation.getSingleCollection"]);
                trpcUtils.invalidateQueries(["navigation.getCollectionSets"]);
            },
            onMutate: () => {
                trpcUtils.cancelQuery(["navigation.getSingleCollection"]);
                const prevData = trpcUtils.getQueryData([
                    "navigation.getSingleCollection",
                ]);
                const prevSets = trpcUtils.getQueryData([
                    "navigation.getCollectionSets",
                ]);
                trpcUtils.setQueryData(
                    ["navigation.getSingleCollection"],
                    null
                );
                trpcUtils.setQueryData(["navigation.getCollectionSets"], []);
                return { prevData, prevSets };
            },
        }
    );
    return deleteCollectionMutation;
};

export default useDeleteCollectionMutation;
