import { useState } from "react";

import { ActionIcon } from "@mantine/core";

import PfLinkedUsername from "@/components/User/Profile/PfLinkedUsername";
import UpvoteIcon from "@/components/Common/Icons/UpvoteIcon";
import DownvoteIcon from "@/components/Common/Icons/DownvoteIcon";

import { cloneDeep } from "lodash";
import { UpdateDebateViewerVoteStatus } from "@/lib/functions/debate";
import { UserScfDebate } from "@/types/debate.types";

interface DebateCardProps {
	debate: UserScfDebate;
}

const DebateViewer = ({ debate }: DebateCardProps) => {
	const [voteStatus, setVoteStatus] = useState<{
		upvotes: number;
		userUpvoted: boolean;
		userDownvoted: boolean;
	}>({
		upvotes: debate.upvotes,
		userUpvoted: debate.userUpvoted,
		userDownvoted: debate.userDownvoted,
	});

	const updateVote = (action: "upvote" | "downvote") => {
		const newStatus = cloneDeep(voteStatus);
		UpdateDebateViewerVoteStatus(action, newStatus);
		setVoteStatus(newStatus);
	};

	return (
		<div className="w-full rounded-md bg-white py-3 px-4">
			<h2 className="text-neutral-900 font-medium lg:text-lg">
				{debate.title}
			</h2>
			<div className="w-full mt-2 flex justify-between items-center">
				<PfLinkedUsername
					id={debate.author.id}
					username={debate.author.name}
					reputation={100}
				/>
				<div className="flex items-center gap-1.5 text-primary-600">
					<div className="flex items-center gap-0.5 md:gap-1">
						<ActionIcon
							onClick={(e) => {
								e.stopPropagation();
								updateVote("upvote");
							}}
						>
							<UpvoteIcon
								className="w-5 md:w-[22px] fill-primary-600"
								varient={voteStatus.userUpvoted ? "filled" : "outline"}
							/>
						</ActionIcon>
						<p className="text-sm">{voteStatus.upvotes}</p>
						<ActionIcon
							onClick={(e) => {
								e.stopPropagation();
								updateVote("downvote");
							}}
						>
							<DownvoteIcon
								className="w-5 md:w-[22px] fill-primary-600"
								varient={voteStatus.userDownvoted ? "filled" : "outline"}
							/>
						</ActionIcon>
					</div>
					{/* <NewspaperIcon className="w-[22px] md:w-6" /> */}
				</div>
			</div>

			<p className="mt-2 text-sm lg:text-base text-neutral-800 whitespace-pre-wrap">
				{debate.content}
			</p>
		</div>
	);
};

export default DebateViewer;
