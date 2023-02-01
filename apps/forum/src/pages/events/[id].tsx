import { AppShell } from "@/components/AppShell";

import IssueViewer from "@/components/Issues/IssueViewer";
import NewDebate from "@/components/Debate/Input/NewDebate";
import DebateCards from "@/components/Debate/Sections/DebateCards";

import { SampleIssue } from "@/templateData/issues";

const EventsPage = () => {
	const event = SampleIssue;

	return (
		<AppShell title={`Speakup - ${event.title}`}>
			<div className="w-full max-w-2xl mx-auto mt-16 m-20 px-4 xl:max-w-3xl flex flex-col gap-5">
				<IssueViewer issue={event} />
				<NewDebate />
				<DebateCards />
			</div>
		</AppShell>
	);
};

export default EventsPage;
