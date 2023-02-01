import { ActionIcon, Loader, Spoiler } from "@mantine/core";

import DownvoteIcon from "@/components/Common/Icons/DownvoteIcon";
import UpvoteIcon from "@/components/Common/Icons/UpvoteIcon";
import PfLinkedUsername from "@/components/User/Profile/PfLinkedUsername";

import { UIDebate } from "@/types/debate.types";
import { useDebateStore } from "@/lib/stores/debateStores";
import { useRouter } from "next/router";

interface DebateCardProps {
	debate: UIDebate;
}

const DebateCard = ({ debate }: DebateCardProps) => {
	const updateVote = useDebateStore((state) => state.updateVote);

	const router = useRouter();

	return (
		<div
			className="w-full rounded-md bg-white py-3 px-4 cursor-pointer"
			onClick={() => {
				router.push(`/debate/${debate.id}`);
			}}
		>
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
								updateVote(debate.id, "upvote");
							}}
						>
							<UpvoteIcon
								className="w-5 md:w-[22px] fill-primary-600"
								varient={debate.userUpvoted ? "filled" : "outline"}
							/>
						</ActionIcon>
						<p className="text-sm">{debate.upvotes}</p>
						<ActionIcon
							onClick={(e) => {
								e.stopPropagation();
								updateVote(debate.id, "downvote");
							}}
						>
							<DownvoteIcon
								className="w-5 md:w-[22px] fill-primary-600"
								varient={debate.userDownvoted ? "filled" : "outline"}
							/>
						</ActionIcon>
					</div>
					{/* <NewspaperIcon className="w-[22px] md:w-6" /> */}
				</div>
			</div>
			<Spoiler
				maxHeight={130}
				classNames={{
					control: "text-sm text-primary-600",
				}}
				showLabel="顯示更多"
				hideLabel="顯示較少"
			>
				<p className="mt-2 text-sm lg:text-base text-neutral-800 whitespace-pre-wrap">
					{debate.content}
				</p>
			</Spoiler>

			{debate.typing.length > 0 && (
				<div className="pl-0.5 text-gray-600 flex items-center mt-2 gap-2">
					<Loader className="lg:hidden" size={14} color="gray" variant="dots" />
					<Loader className="lg:block" size={20} color="gray" variant="dots" />
					<p className="text-xs lg:text-sm">
						{debate.typing.reduce((prev, cur) => `${prev}, ${cur}`)} 正在輸入
					</p>
				</div>
			)}
		</div>
	);
};

export default DebateCard;
