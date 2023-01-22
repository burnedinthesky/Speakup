import { AppShell, Header } from "components/AppShell";
import DebateCard from "components/Debate/DebateCard";
import NewDebate from "components/Debate/Input/NewDebate";
import IssueViewer from "components/Issues/IssueViewer";
import { SampleIssue } from "templateData/issues";

const EventsPage = () => {
	const event = SampleIssue;

	return (
		<AppShell title={`Speakup - ${event.title}`}>
			<div className="w-full max-w-2xl mx-auto mt-16 m-20 px-4 xl:max-w-3xl flex flex-col gap-5">
				<IssueViewer issue={event} />
				<NewDebate />
				<DebateCard />
			</div>
		</AppShell>
	);
};

export default EventsPage;
