import { useEffect } from "react";
import { SpeakerphoneIcon } from "@heroicons/react/outline";

import DebateCard from "../DebateCard";
import { useDebateStore } from "@/lib/stores/debateStores";
import { GetRandomDebate } from "@/templateData/debates";

const SampleDebate = GetRandomDebate();

const OtherPOVDebates = () => {
	const debates = useDebateStore((state) => state.otherPOV);

	const { addDebate } = useDebateStore((state) => ({
		addDebate: state.addToTheme,
		registerTyping: state.registerTypingUser,
		unregisterTyping: state.unregisterTypingUser,
	}));

	useEffect(() => {
		// addDebate([SampleDebate], "otherPOV");
	}, []);

	return (
		<div
			style={{
				display: debates.length > 0 ? undefined : "none",
			}}
			className="w-full text-neutral-600"
		>
			<div className="flex gap-1">
				<SpeakerphoneIcon className="w-4" />
				<p className="text-xs">換個角度看</p>
			</div>
			<div className="w-full mt-2 flex flex-col gap-4">
				{debates.map((debate) => (
					<DebateCard key={debate.id} debate={debate} />
				))}
			</div>
		</div>
	);
};

export default OtherPOVDebates;
