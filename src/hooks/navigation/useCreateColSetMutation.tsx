import { showNotification } from "@mantine/notifications";
import { trpc } from "utils/trpc";

const useCreateColSetMutation = (completeFn: () => void) => {
	const createNewColSet = trpc.navigation.createCollectionSet.useMutation({
		onSettled: (_, error) => {
			if (error) {
				showNotification({
					color: "red",
					title: "發生錯誤",
					message: "請再試一次",
				});
			}

			completeFn();
		},
	});

	return createNewColSet;
};

export default useCreateColSetMutation;
