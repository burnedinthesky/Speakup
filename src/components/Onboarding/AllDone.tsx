import { Button } from "@mantine/core";

interface PageProps {
	isLoading: boolean;
	submitOnboard: () => void;
}

const AllDone = ({ isLoading, submitOnboard }: PageProps) => {
	return (
		<div className="relative h-full w-full pb-12">
			<div className="h-full w-full overflow-y-auto scrollbar-hide flex flex-col items-center">
				<p className="mt-6 align-middle text-center text-neutral-700">
					再次歡迎你來到Speakup，
					<span className="inline-block">
						我們期待您有一個絕佳的線上討論體驗！
					</span>
				</p>
				<Button
					className="mt-6 mx-auto"
					loading={isLoading}
					onClick={submitOnboard}
					size="sm"
					variant="outline"
				>
					開始使用Speakup
				</Button>
			</div>
		</div>
	);
};

export default AllDone;
