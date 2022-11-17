import { trpc } from "../../utils/trpc";
import { showErrorNotification } from "../../lib/errorHandling";

interface useAddArgumentMutationProps {
    closeCommentInput: () => void;
}

const useAddArgumentMutation = ({
    closeCommentInput,
}: useAddArgumentMutationProps) => {
    const trpcUtils = trpc.useContext();

    const addArgumentMutation = trpc.useMutation("arguments.createArgument", {
        onSettled: () => {
            closeCommentInput();
            trpcUtils.invalidateQueries(["arguments.getArticleArguments"]);
        },
        onError: () => {
            showErrorNotification({
                title: "留言失敗",
                message: "請再試一次",
            });
        },
    });

    return addArgumentMutation;
};

export default useAddArgumentMutation;
