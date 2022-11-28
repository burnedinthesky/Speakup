import { showNotification } from "@mantine/notifications";
import { ArgumentThread } from "../../types/comments.types";
import { trpc } from "../../utils/trpc";

interface useArgCreateThreadMutationProps {
    setAddedThreads: (
        setValueFunc: (prevState: ArgumentThread[]) => ArgumentThread[]
    ) => void;
    selectedThread: number | null;
}

const useArgCreateThreadMutation = (
    completeFn: (data?: ArgumentThread) => void
) => {
    const trpcUtils = trpc.useContext();

    const createThreadMutation = trpc.arguments.createNewThread.useMutation({
        onSettled: (data, error) => {
            if (error) {
                showNotification({
                    color: "red",
                    title: "發生錯誤",
                    message: "請再試一次",
                });
            }

            completeFn(data);
        },
    });

    return createThreadMutation;
};

export default useArgCreateThreadMutation;
