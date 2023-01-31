import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "@mantine/core";

interface NewDebateButtonProps {
	toggleOpen: (value: boolean) => void;
}

const NewDebateButton = ({ toggleOpen }: NewDebateButtonProps) => {
	return (
		<Button
			className="w-full  text-primary-600 bg-transparent hover:bg-gray-50"
			onClick={() => {
				toggleOpen(true);
			}}
		>
			<PlusIcon className="w-6" />
			<p>開始辯論</p>
		</Button>
	);
};

export default NewDebateButton;
