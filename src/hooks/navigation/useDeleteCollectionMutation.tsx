import { showNotification } from "@mantine/notifications";
import { CollectionSet } from "../../types/navigation.types";
import { trpc } from "../../utils/trpc";

const useDeleteCollectionMutation = ({ articleId }: { articleId: string }) => {
    const trpcUtils = trpc.useContext();

    const deleteCollectionMutation =
        trpc.navigation.deleteUserCollection.useMutation({
            onSettled(data, error, variables, context) {
                const ctx = context as {
                    prevData: {
                        collectionSets: number[];
                        id: number;
                    } | null;
                    prevSets: CollectionSet[];
                };
                if (error) {
                    trpcUtils.navigation.getSingleCollection.setData(
                        { articleId: articleId },
                        ctx.prevData
                    );
                    trpcUtils.navigation.getCollectionSets.setData(
                        undefined,
                        ctx.prevSets
                    );

                    showNotification({
                        title: "發生錯誤",
                        message: "取消收藏失敗，請再試一次",
                        color: "red",
                    });
                }
                trpcUtils.navigation.getSingleCollection.invalidate();
                trpcUtils.navigation.getCollectionSets.invalidate();
            },
            onMutate: () => {
                trpcUtils.navigation.getSingleCollection.cancel();
                const prevData =
                    trpcUtils.navigation.getSingleCollection.getData();
                const prevSets =
                    trpcUtils.navigation.getCollectionSets.getData();

                trpcUtils.navigation.getSingleCollection.setData(
                    { articleId },
                    null
                );
                trpcUtils.navigation.getCollectionSets.setData(undefined, []);
                return { prevData, prevSets };
            },
        });
    return deleteCollectionMutation;
};

export default useDeleteCollectionMutation;
