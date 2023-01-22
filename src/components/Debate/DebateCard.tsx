import { ActionIcon, Loader, Spoiler } from "@mantine/core";
import { ArrowsExpandIcon, NewspaperIcon } from "@heroicons/react/outline";

import DownvoteIcon from "components/Common/Icons/DownvoteIcon";
import UpvoteIcon from "components/Common/Icons/UpvoteIcon";
import PfLinkedUsername from "components/User/Profile/PfLinkedUsername";

import { Debate } from "types/debate.types";

interface DebateCardProps {}

const DebateCard = () => {
	const debate: Debate = {
		id: "123",
		title: "Lorem duis capidata voluptat",
		author: {
			id: "asdf",
			image: "asdf",
			name: "adf",
		},
		content:
			"Lorem duis cupidatat voluptate adipisicing dolor laboris sint est sunt occaecat tempor non Lorem nulla. Nisi ullamco voluptate sit incididunt pariatur. Amet eiusmod commodo qui id duis tempor consequat et tempor velit adipisicing. Sunt eiusmod amet deserunt velit labore commodo consequat in elit est sint eu. Incididunt esse pariatur do adipisicing commodo voluptate. Ex dolor minim non nulla enim consequat proident dolor esse aute aliqua. Laboris incididunt est deserunt adipisicing ullamco.",
		news: [],
		upvotes: 1234,
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
						<ActionIcon>
							<UpvoteIcon className="w-5 md:w-[22px] fill-primary-600" />
						</ActionIcon>
						<p className="text-sm">{debate.upvotes}</p>
						<ActionIcon>
							<DownvoteIcon className="w-5 md:w-[22px] fill-primary-600" />
						</ActionIcon>
					</div>
					<NewspaperIcon className="w-[22px] md:w-6" />
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
			<button className="text-primary-600 flex items-center mt-2 gap-2 lg:gap-1">
				<ArrowsExpandIcon className="w-5 " />
				<p className="text-sm">展開辯論</p>
			</button>
			<div className="pl-0.5 text-gray-600 flex items-center mt-2 gap-2">
				<Loader className="lg:hidden" size={14} color="gray" variant="dots" />
				<Loader className="lg:block" size={20} color="gray" variant="dots" />
				<p className="text-xs lg:text-sm">Dolor amet 正在輸入</p>
			</div>
		</div>
	);
};

export default DebateCard;
