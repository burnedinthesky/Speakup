import { useState, forwardRef } from "react";

import { CommentReactionButtons } from "../OpCardComponents/CommentReactionButtons";
import ExtendedMenu from "../OpCardComponents/ExtendedMenu";

import { Comment } from "../../../../types/comments.types";
import { Avatar, Badge } from "@mantine/core";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import PfLinkedUsername from "../../../User/Profile/PfLinkedUsername";

interface CommentCardProps {
	data: Comment;
	deleteFunction: (commentId: number, motherComment?: number) => void;
}

const CommentCard = forwardRef<HTMLDivElement, CommentCardProps>(
	({ data, deleteFunction }, ref) => {
		const [interaction, setInteraction] = useState<
			"liked" | "supported" | "disliked" | null
		>(
			data.userLiked
				? "liked"
				: data.userSupported
				? "supported"
				: data.userDisliked
				? "disliked"
				: null,
		);

		const [enableAnim, setEnableAnim] = useState<boolean>(false);

		const borderColor = (stance: string) =>
			stance === "sup" || true
				? "border-green-300"
				: stance === "agn"
				? "border-red-400"
				: "border-neutral-300";

		return (
			<>
				<div className="flex w-full gap-3" ref={ref}>
					<Avatar
						classNames={{
							root: `border-2 ${borderColor(data.stance)}`,
						}}
						className="border-2"
						src={data.author.profileImg}
						alt="Profile"
						radius="xl"
						size="md"
					>
						{data.author.name}
					</Avatar>
					<div className="flex-grow">
						<div className="flex items-center gap-2">
							<PfLinkedUsername
								id={data.author.id}
								username={data.author.name}
								reputation={data.author.reputation}
							/>
							<div className="h-[18px] w-24 md:w-36">
								{data.thread && (
									<Badge leftSection={<ChatAlt2Icon className="h-4 w-4" />}>
										{data.thread.name}
									</Badge>
								)}
							</div>
						</div>
						<p className="mt-2 mb-3 text-base text-neutral-700">
							{data.content}
						</p>

						<div className="mb-2 flex items-center justify-between">
							<div className="flex h-6">
								<CommentReactionButtons
									data={data}
									cardType="comment"
									enableAnim={enableAnim}
									setEnableAnim={setEnableAnim}
									interaction={interaction}
									setInteraction={setInteraction}
								/>
							</div>
							<div>
								<ExtendedMenu
									dataId={data.id}
									isAuthor={data.isAuthor}
									deleteFunction={deleteFunction}
									allowReply={false}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},
);

CommentCard.displayName = "CommentCard";

export default CommentCard;
