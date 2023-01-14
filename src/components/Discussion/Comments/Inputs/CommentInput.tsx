import { useState } from "react";

import BaseCommentInput from "./BaseOpInput";
import ThreadsMenu from "../Threads/ThreadsMenu";
import useArgAddCommentMutation from "hooks/discussion/useArgAddCommentMutation";
import type { ArgumentThread, Stances } from "types/comments.types";

interface CommentInputProps {
	argumentId: number;
	threads: ArgumentThread[];
	viewingSelectedThread: number | null;
	setShowCommentInput: (value: boolean) => void;
	setOpenNewThreadModal?: (value: boolean) => void;
}

const CommentInput = ({
	argumentId,
	threads,
	viewingSelectedThread,
	setShowCommentInput,
	setOpenNewThreadModal,
}: CommentInputProps) => {
	const [selectedStance, setSelectedStance] = useState<Stances | null>(null);
	const [selectedThread, setSelectedThread] = useState<number | null>(null);

	const addCommentMutation = useArgAddCommentMutation({
		closeCommentInput() {
			setShowCommentInput(false);
			setSelectedStance(null);
			setSelectedStance(null);
		},
		selectedThread: viewingSelectedThread,
	});

	const submitComment = (cmtContent: string, cmtStance: Stances) => {
		addCommentMutation.mutate({
			content: cmtContent,
			stance: cmtStance,
			thread: viewingSelectedThread ? viewingSelectedThread : selectedThread,
			argument: argumentId,
		});
	};

	return (
		<div className="ml-10 mb-2 flex w-11/12 items-center pt-1">
			<BaseCommentInput
				addComment={submitComment}
				setCommentEntering={setShowCommentInput}
				isMutationLoading={addCommentMutation.isLoading}
				shrinkAtStart={false}
				selectedStance={selectedStance}
				setSelectedStance={setSelectedStance}
			>
				{viewingSelectedThread ? (
					<ThreadsMenu
						threads={threads.filter((ele) => ele.id === viewingSelectedThread)}
						selectedThread={viewingSelectedThread}
						setSelectedThread={() => {}}
					/>
				) : (
					<ThreadsMenu
						threads={threads}
						selectedThread={selectedThread}
						setSelectedThread={setSelectedThread}
						setOpenNewThreadModal={setOpenNewThreadModal}
					/>
				)}
			</BaseCommentInput>
		</div>
	);
};

export default CommentInput;
