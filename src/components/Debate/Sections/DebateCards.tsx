import GeneralDebates from "components/Debate/Sections/General";
import InDebateDebates from "components/Debate/Sections/InDebate";
import OtherPOVDebates from "components/Debate/Sections/OtherPov";
import UserLaunchedDebates from "components/Debate/Sections/UserLaunched";

const DebateCards = () => {
	return (
		<div className="flex flex-col gap-5">
			<InDebateDebates />
			<OtherPOVDebates />
			<UserLaunchedDebates />
			<GeneralDebates />
		</div>
	);
};

export default DebateCards;
