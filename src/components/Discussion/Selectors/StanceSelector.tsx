import { MouseEvent } from "react";
import { Tabs } from "@mantine/core";
import SortSelector from "./SortSelector";

interface StanceSelectorProps {
	viewingStance: string | null;
	screenSize: string;
	setViewingStance: (value: string) => void;
	updateSortMethod: (e: MouseEvent<HTMLButtonElement>) => void;
}

const StanceSelector = ({
	viewingStance,
	screenSize,
	setViewingStance,
	updateSortMethod,
}: StanceSelectorProps) => {
	return (
		<Tabs
			color="primary"
			value={viewingStance}
			variant={screenSize == "mob" ? "outline" : "default"}
			onTabChange={setViewingStance}
		>
			<Tabs.List position="center" grow>
				<Tabs.Tab value="sup">支持</Tabs.Tab>
				<Tabs.Tab value="both">無區分立場</Tabs.Tab>
				<Tabs.Tab value="agn">反對</Tabs.Tab>
				{screenSize == "mob" && (
					<SortSelector
						screenSize={screenSize}
						updateSortMethod={updateSortMethod}
					/>
				)}
			</Tabs.List>
		</Tabs>
	);
};

export default StanceSelector;
