import { PlusCircleIcon } from "@heroicons/react/outline";
import MobileDrawer from "../../Common/Overlays/MobileDrawer";
import CollectionSetCard from "./CollectionSetCard";
import CreateColSetModal from "./CreateCollectionsSetModal";

interface ColSetDrawerProps {
	sets: {
		id: number;
		name: string;
	}[];
	selectedSet: number | null;
	setSelectedSet: (value: number | null) => void;
	excludedSets: number[];
	setExcludedSets: (fn: (cur: number[]) => number[]) => void;
	mobileDrawerOpened: boolean;
	setMobileDrawerOpened: (opened: boolean) => void;
	openAddSetModal: boolean;
	setOpenAddSetModal: (value: boolean) => void;
}

const ColSetDrawer = ({
	sets,
	selectedSet,
	setSelectedSet,
	excludedSets,
	setExcludedSets,
	mobileDrawerOpened,
	setMobileDrawerOpened,
	openAddSetModal,
	setOpenAddSetModal,
}: ColSetDrawerProps) => {
	return (
		<MobileDrawer
			opened={mobileDrawerOpened}
			onClose={() => {
				setMobileDrawerOpened(false);
			}}
			maxWidth={340}
		>
			<>
				<h2 className="text-md text-primary-800 lg:text-xl">選擇收藏集</h2>
				<div className="mt-5 flex flex-col items-start gap-2 text-lg text-primary-800">
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
						className="mt-1 flex items-center"
						onClick={() => {
							setOpenAddSetModal(true);
						}}
					>
						<PlusCircleIcon className="mr-2 h-6" />
						<p className="text-sm">新增收藏集</p>
					</button>
				</div>
				<CreateColSetModal
					opened={openAddSetModal}
					setOpened={setOpenAddSetModal}
				/>
			</>
		</MobileDrawer>
	);
};

export default ColSetDrawer;
