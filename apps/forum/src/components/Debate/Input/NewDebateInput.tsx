import { useRef } from "react";
import { ActionIcon, Textarea, TextInput } from "@mantine/core";
import { PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import { uniqueId } from "lodash";
import { useDebateStore } from "@/lib/stores/debateStores";

interface NewDebateInputProps {
	toggleOpen: (value: boolean) => void;
}

const NewDebateInput = ({ toggleOpen }: NewDebateInputProps) => {
	const titleRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLTextAreaElement>(null);

	const registerDebate = useDebateStore((state) => state.addToTheme);

	const handleSubmit = () => {
		if (!titleRef.current || !contentRef.current)
			throw new Error("DOM mounting not complete yet");
		const title = titleRef.current.value;
		const content = titleRef.current.value;

		registerDebate(
			[
				{
					id: uniqueId(),
					author: {
						id: "asdf",
						name: "asdf",
					},
					title: title,
					content: content,
					upvotes: 3,
					news: [],
					userUpvoted: false,
					userDownvoted: false,
				},
			],
			"userLaunched",
		);
		titleRef.current.value = "";
		contentRef.current.value = "";
		toggleOpen(false);
	};

	return (
		<div className="w-full bg-white rounded-md">
			<div className="w-full flex items-center justify-between">
				<TextInput
					classNames={{
						root: "flex-grow",
						input: "bg-transparent border-none px-0 text-base text-gray-700",
					}}
					ref={titleRef}
					placeholder="辯題"
				/>
				<ActionIcon
					onClick={() => {
						toggleOpen(false);
					}}
				>
					<XIcon className="w-6 text-gray-600 bg-transparent" />
				</ActionIcon>
			</div>
			<Textarea
				classNames={{
					input:
						"border-t-0 border-x-0 text-sm rounded-none border-b border-b-gray-300 px-0 text-gray-600",
				}}
				placeholder="辯論內容"
				ref={contentRef}
				autosize
				minRows={2}
			/>
			<div className="w-full mt-2 flex justify-end">
				<ActionIcon onClick={handleSubmit}>
					<PaperAirplaneIcon className="rotate-45 text-primary-600 w-6 translate-x-0.5" />
				</ActionIcon>
			</div>
		</div>
	);
};

export default NewDebateInput;
