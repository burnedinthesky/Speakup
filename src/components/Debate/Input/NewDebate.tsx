import { useState } from "react";
import NewDebateButton from "./NewDebateButton";
import NewDebateInput from "./NewDebateInput";

const NewDebate = () => {
	const [inputOpen, setInputOpen] = useState<boolean>(false);

	return (
		<div
			className={`w-full bg-white rounded-md   ${
				inputOpen ? "py-3 px-4" : "hover:bg-gray-50 py-1"
			}`}
		>
			{inputOpen ? (
				<NewDebateInput toggleOpen={setInputOpen} />
			) : (
				<NewDebateButton toggleOpen={setInputOpen} />
			)}
		</div>
	);
};

export default NewDebate;
