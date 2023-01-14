import { useState } from "react";

import { Badge } from "@mantine/core";
import { ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/outline";

import CollectionSetCard from "./CollectionSetCard";
import CreateColSetModal from "./CreateCollectionsSetModal";
import ColSetDrawer from "./ColSetDrawer";

interface CollectionSetSelectorProps {
	sets: {
		id: number;
		name: string;
	}[];
	selectedSet: number | null;
	setSelectedSet: (value: number | null) => void;
}

const CollectionSetSelector = ({
	sets,
	selectedSet,
	setSelectedSet,
}: CollectionSetSelectorProps) => {
	const [openAddSetModal, setOpenAddSetModal] = useState<boolean>(false);
	const [excludedSets, setExcludedSets] = useState<number[]>([]);

	const [mobileDrawerOpened, setMobileDrawerOpened] = useState<boolean>(false);

	return (
		<>
			<div className="block lg:hidden">
				<div className="fixed bottom-12 left-0 z-10 flex h-10 w-screen items-center justify-center bg-neutral-100 lg:bottom-0 lg:pl-64">
					<button
						className="flex items-center"
						onClick={() => {
							setMobileDrawerOpened(true);
						}}
					>
						<Badge
							leftSection={<ChevronUpIcon className="h-5 text-primary-700" />}
							size="lg"
							classNames={{
								root: "bg-primary-100 px-8 py-1 font-extralight",
							}}
						>
							展開收藏集
						</Badge>
					</button>
				</div>
				<ColSetDrawer
					sets={sets}
					selectedSet={selectedSet}
					setSelectedSet={setSelectedSet}
					excludedSets={excludedSets}
					setExcludedSets={setExcludedSets}
					openAddSetModal={openAddSetModal}
					setOpenAddSetModal={setOpenAddSetModal}
					mobileDrawerOpened={mobileDrawerOpened}
					setMobileDrawerOpened={setMobileDrawerOpened}
				/>
			</div>
			<div className="fixed top-[136px] right-6 hidden max-h-[calc(100vh-216px)] w-56 overflow-y-auto rounded-lg bg-white py-5 px-6 text-primary-800 lg:block 2xl:right-14 2xl:w-64">
				<h2 className="text-xl">您的收藏</h2>
				<div className="mt-5 flex flex-col items-start gap-2 text-lg">
					{sets
						.filter((ele) => !excludedSets.includes(ele.id))
						.map((set, i) => (
							<CollectionSetCard
								key={i}
								set={set}
								selectedSet={selectedSet}
								setSelectedSet={setSelectedSet}
								setExcludedSets={setExcludedSets}
								setMobileDrawerOpened={setMobileDrawerOpened}
							/>
						))}
					<button
						className="mt-2 flex items-center"
						onClick={() => {
							setOpenAddSetModal(true);
						}}
					>
						<PlusCircleIcon className="mr-2 h-6" />
						<p>新增收藏集</p>
					</button>
				</div>
				<CreateColSetModal
					opened={openAddSetModal}
					setOpened={setOpenAddSetModal}
				/>
			</div>
		</>
	);
};

export default CollectionSetSelector;
