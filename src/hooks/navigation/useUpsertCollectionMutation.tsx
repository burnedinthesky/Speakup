import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";

const useUpsertCollectionMutation = ({ articleId }: { articleId: string }) => {
    const trpcUtils = trpc.useContext();

    const upsertCollectionMutation =
        trpc.navigation.upsertUserCollection.useMutation({
            onSettled(_, error, __, context) {
                const ctx = context as {
                    prevData: {
                        collectionSets: number[];
                        id: number;
                    } | null;
                };

                if (error) {
                    trpcUtils.navigation.getSingleCollection.setData(
                        { articleId },
                        ctx.prevData
                    );
                    showNotification({
                        title: "發生錯誤",
                        message: "收藏更新失敗，請再試一次",
                        color: "red",
                    });
                }
                trpcUtils.navigation.getSingleCollection.invalidate();
            },
            onMutate: (variables) => {
                trpcUtils.navigation.getSingleCollection.cancel();

                const prevData =
                    trpcUtils.navigation.getSingleCollection.getData();

                trpcUtils.navigation.getSingleCollection.setData(
                    { articleId },
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
        });

    return upsertCollectionMutation;
};

export default useUpsertCollectionMutation;
