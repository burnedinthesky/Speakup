import { AppShell, Header } from "components/AppShell";
import IssueViewer from "components/Issues/IssueViewer";
import { SampleIssue } from "templateData/issues";

const EventsPage = () => {
	const event = SampleIssue;

	return (
		<AppShell title={`Speakup - ${event.title}`}>
			<div className="w-full max-w-2xl mx-auto mt-16 px-4 ">
				<IssueViewer issue={event} />
			</div>
		</AppShell>
	);
};

export default EventsPage;
