import IssueViewer from "components/Issues/IssueViewer";
import { SampleIssue } from "templateData/issues";

const EventsPage = () => {
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 overflow-y-auto scrollbar-hide bg-gray-100">
			<div className="w-full max-w-2xl mx-auto mt-16 px-4">
				<IssueViewer issue={SampleIssue} />
			</div>
		</div>
	);
};

export default EventsPage;
