import { trpc } from "utils/trpc";
import { showErrorNotification } from "lib/errorHandling";

interface useArgAddCommentMutationProps {
	closeCommentInput: () => void;
	selectedThread: number | null;
}

const useArgAddCommentMutation = ({
	closeCommentInput,
	selectedThread,
}: useArgAddCommentMutationProps) => {
	const trpcUtils = trpc.useContext();

	const addCommentMutation = trpc.comments.createComment.useMutation({
		onSettled: () => {
			trpcUtils.comments.getArgumentComments.invalidate();
			closeCommentInput();
		},
		onSuccess: (data, variables) => {
			trpcUtils.comments.getArgumentComments.setInfiniteData(
				{
					argumentId: variables.argument,
					sort: "",
					stance: "both",
					limit: 20,
					threadId: selectedThread,
				},
				(prev) => {
					if (!prev) {
						return {
							pages: [{ retData: [data], nextCursor: undefined }],
							pageParams: [],
						};
					}
					return {
						...prev,
						pages: prev.pages.map((page) => ({
							...page,
							retData: [...page.retData, data],
						})),
					};
				},
			);
		},
		onError: () => {
			showErrorNotification({
				message: "留言失敗，請再試一次",
			});
		},
	});

	return addCommentMutation;
};

export default useArgAddCommentMutation;
