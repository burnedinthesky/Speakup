import { showNotification } from "@mantine/notifications";
import { trpc } from "../../utils/trpc";

const useCreateColSetMutation = () => {
    const trpcUtils = trpc.useContext();

    const createNewColSet = trpc.useMutation(
        ["navigation.createCollectionSet"],
        {
            onSuccess: (data, _, context) => {
                const ctx = context as {
                    minId: number;
                };

                trpcUtils.setQueryData(
                    ["navigation.getCollectionSets"],
                    (prev) => {
                        if (!prev) return [];
                        return prev.map((ele) =>
                            ele.id !== ctx.minId ? ele : data
                        );
                    }
                );
                trpcUtils.invalidateQueries(["navigation.getCollectionSets"]);
            },
            onError: (_, __, context) => {
                const ctx = context as {
                    minId: number;
                };
                showNotification({
                    title: "發生未知錯誤",
                    message: "新增收藏集失敗",
                    color: "red",
                });
                trpcUtils.setQueryData(
                    ["navigation.getCollectionSets"],
                    (prev) => {
                        if (!prev) return [];
                        return prev.filter((ele) => ele.id !== ctx.minId);
                    }
                );
                trpcUtils.invalidateQueries(["navigation.getCollectionSets"]);
            },
            onMutate: (variables) => {
                trpcUtils.cancelQuery(["navigation.getCollectionSets"]);
                let minId = -1;
                trpcUtils.setQueryData(
                    ["navigation.getCollectionSets"],
                    (prev) => {
                        if (!prev) return [];
                        prev.forEach((ele) => {
                            if (ele.id < minId) minId = ele.id - 1;
                        });
                        return [
                            {
                                id: minId,
                                name: variables.name,
                            },
                            ...prev,
                        ];
                    }
                );
                return {
                    minId,
                };
            },
        }
    );

    return createNewColSet;
};

export default useCreateColSetMutation;
