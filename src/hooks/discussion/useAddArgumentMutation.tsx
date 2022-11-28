import { trpc } from "../../utils/trpc";
import { showErrorNotification } from "../../lib/errorHandling";

interface useAddArgumentMutationProps {
    closeCommentInput: () => void;
}

const useAddArgumentMutation = ({
    closeCommentInput,
}: useAddArgumentMutationProps) => {
    const trpcUtils = trpc.useContext();

    const addArgumentMutation = trpc.arguments.createArgument.useMutation({
        onSettled: () => {
            closeCommentInput();
            trpcUtils.arguments.getArticleArguments.invalidate();
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
