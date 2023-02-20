export const UpdateDebateViewerVoteStatus = (
	action: "upvote" | "downvote",
	targetStatus: {
		upvotes: number;
		userUpvoted: boolean;
		userDownvoted: boolean;
	},
) => {
	if (action === "upvote") {
		if (targetStatus.userUpvoted) {
			targetStatus.upvotes -= 1;
			targetStatus.userUpvoted = false;
		} else if (targetStatus.userDownvoted) {
			targetStatus.upvotes += 2;
			targetStatus.userDownvoted = false;
			targetStatus.userUpvoted = true;
		} else {
			targetStatus.upvotes += 1;
			targetStatus.userUpvoted = true;
		}
		return;
	}
	if (targetStatus.userDownvoted) {
		targetStatus.upvotes += 1;
		targetStatus.userDownvoted = false;
	} else if (targetStatus.userUpvoted) {
		targetStatus.upvotes -= 2;
		targetStatus.userUpvoted = false;
		targetStatus.userDownvoted = true;
	} else {
		targetStatus.upvotes -= 1;
		targetStatus.userDownvoted = true;
	}
};
