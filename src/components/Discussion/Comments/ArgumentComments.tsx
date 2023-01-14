import { useState } from "react";
import { trpc } from "utils/trpc";
import { showNotification } from "@mantine/notifications";

import CommentCard from "./OpCards/CommentCard";

import { Comment } from "types/comments.types";

interface ArgumentCommentProps {
	data: Comment[];
}

const ArgumentComments = ({ data }: ArgumentCommentProps) => {
	const [excludedIDs, setExcludedIDs] = useState<number[]>([]);

	const trpcUtils = trpc.useContext();

	const deleteCommentMutation = trpc.comments.deleteComment.useMutation({
		onSettled: () => {
			trpcUtils.comments.getArgumentComments.invalidate();
		},
		onError: (_, variables) => {
			setExcludedIDs((cur) =>
				cur.filter((element) => variables.id !== element),
			);
			showNotification({
				title: "發生未知錯誤",
				message: "留言刪除失敗，請再試一次",
			});
		},
		onMutate: (variables) => {
			setExcludedIDs((cur) => cur.concat([variables.id]));
		},
	});

	return (
		<div className="mt-2 ml-auto flex w-[88%] flex-col md:w-11/12 lg:w-[88%] xl:w-11/12">
			{data
				.filter((element) => !excludedIDs.includes(element.id))
				.map((comment, i) => (
					<CommentCard
						key={i}
						data={comment}
						deleteFunction={() => {
							deleteCommentMutation.mutate({ id: comment.id });
						}}
					/>
				))}
		</div>
	);
};

export default ArgumentComments;
