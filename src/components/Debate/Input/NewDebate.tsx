import { PlusIcon } from "@heroicons/react/outline";

const NewDebate = () => {
	return (
		<button className="w-full h-10 flex items-center justify-center bg-white rounded-md gap-2 text-primary-600 hover:translate-y-1 transition-transform">
			<PlusIcon className="w-6" />
			<p>開始辯論</p>
		</button>
	);
};

export default NewDebate;
