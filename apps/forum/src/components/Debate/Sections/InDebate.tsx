import { useEffect } from "react";
import { FireIcon } from "@heroicons/react/outline";

import DebateCard from "../Display/DebateCard";
import { useDebateStore } from "@/lib/stores/debateStores";
import { GetRandomDebate } from "@/templateData/debates";

const SampleDebate = GetRandomDebate();

const InDebateDebates = () => {
	const debates = useDebateStore((state) => state.inDebate);

	const { addDebate, registerTyping, unregisterTyping } = useDebateStore(
		(state) => ({
			addDebate: state.addToTheme,
			registerTyping: state.registerTypingUser,
			unregisterTyping: state.unregisterTypingUser,
		}),
	);

	useEffect(() => {
		addDebate([SampleDebate], "inDebate");
		setTimeout(() => {
			registerTyping(SampleDebate.id, "Dolor Amet");
		}, 1000);
		setTimeout(() => {
			unregisterTyping(SampleDebate.id, "Dolar Amet");
		}, 3000);
	}, []);

	return (
		<div
			style={{
				display: debates.length > 0 ? undefined : "none",
			}}
			className="w-full text-neutral-600"
		>
			<div className="flex gap-1">
				<FireIcon className="w-4" />
				<p className="text-xs">正在辯論</p>
			</div>
			<div className="w-full mt-2 flex flex-col gap-4">
				{debates.map((debate) => (
					<DebateCard key={debate.id} debate={debate} />
				))}
			</div>
		</div>
	);
};

export default InDebateDebates;
