import { Menu } from "@mantine/core";
import {
	CollectionIcon,
	FilterIcon,
	SortDescendingIcon,
} from "@heroicons/react/outline";

import DebateCard from "../DebateCard";
import { useDebateStore } from "@/lib/stores/debateStores";

const GeneralDebates = () => {
	const debates = useDebateStore((state) => state.general);

	return (
		<div
			style={{
				display: debates.length > 0 ? undefined : "none",
			}}
			className="w-full text-neutral-600"
		>
			<div className="flex gap-1">
				<CollectionIcon className="w-4" />
				<p className="text-xs">所有辯論</p>
			</div>
			<div className="flex gap-2 mt-3">
				<Menu classNames={{ dropdown: "shadow-xl" }}>
					<Menu.Target>
						<button className="rounded-full bg-white p-2">
							<FilterIcon className="w-6 text-primary-600" />
						</button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>選擇篩選</Menu.Label>
						<Menu.Item>最新回覆在一天內</Menu.Item>
						<Menu.Item>最新回覆在三天內</Menu.Item>
						<Menu.Item>最新回覆在七天內</Menu.Item>
					</Menu.Dropdown>
				</Menu>
				<Menu classNames={{ dropdown: "shadow-xl" }}>
					<Menu.Target>
						<button className="rounded-full bg-white p-2">
							<SortDescendingIcon className="w-6 text-primary-600" />
						</button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>選擇排序</Menu.Label>
						<Menu.Item>回覆數量大於5則</Menu.Item>
						<Menu.Item>回覆數量大於10則</Menu.Item>
						<Menu.Item>回覆數量大於20則</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>
			<div className="w-full mt-2 flex flex-col gap-4">
				{debates.map((debate) => (
					<DebateCard key={debate.id} debate={debate} />
				))}
			</div>
		</div>
	);
};

export default GeneralDebates;
