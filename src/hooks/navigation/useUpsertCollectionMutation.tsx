import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";

const useUpsertCollectionMutation = () => {
    const trpcUtils = trpc.useContext();

    const upsertCollectionMutation = trpc.useMutation(
        ["navigation.upsertUserCollection"],
        {
            onSettled(_, error, __, context) {
                const ctx = context as {
                    prevData: {
                        collectionSets: number[];
                        id: number;
                    } | null;
                };

                if (error) {
                    trpcUtils.setQueryData(
                        ["navigation.getSingleCollection"],
                        ctx.prevData
                    );
                    showNotification({
                        title: "發生錯誤",
                        message: "收藏更新失敗，請再試一次",
                        color: "red",
                    });
                }
                trpcUtils.invalidateQueries(["navigation.getSingleCollection"]);
            },
            onMutate: (variables) => {
                trpcUtils.cancelQuery(["navigation.getSingleCollection"]);

                const prevData = trpcUtils.getQueryData([
                    "navigation.getSingleCollection",
                ]);

                trpcUtils.setQueryData(
                    ["navigation.getSingleCollection"],
                    (prev) => {
                        if (!prev) {
                            return {
                                id: -1,
                                collectionSets: [],
                            };
                        }
                        return {
                            ...prev,
                            collectionSets: variables.collectionSetIds,
                        };
                    }
                );

                return {
                    prevData,
                };
            },
        }
    );

    return upsertCollectionMutation;
};

export default useUpsertCollectionMutation;
