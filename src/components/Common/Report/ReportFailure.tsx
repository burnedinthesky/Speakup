import { useRef } from "react";
import { useSetRecoilState } from "recoil";

import { Button } from "@mantine/core";
import { openDisccusionModal } from "lib/atoms/discussionModal";

const ReportFailure = () => {
	const ReportResultRef = useRef<HTMLDivElement>(null);
	const setReportModalData = useSetRecoilState(openDisccusionModal);

	return (
		<div ref={ReportResultRef}>
			<h3 className="mb-3 text-xl text-neutral-800">發生錯誤，請再試一次</h3>
			<div className="mt-4 flex w-full justify-end">
				<Button
					className="ml-auto bg-primary-700 hover:bg-primary-800"
					onClick={() => {
						setReportModalData({
							opened: false,
							type: null,
							identifier: null,
						});
					}}
				>
					關閉檢舉介面
				</Button>
			</div>
		</div>
	);
};

export default ReportFailure;
