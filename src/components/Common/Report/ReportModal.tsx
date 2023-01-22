import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Modal } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";

import ReportMenu from "./ReportMenu";
import ReportSuccess from "./ReportSuccess";
import ReportFailure from "./ReportFailure";

import { trpc } from "utils/trpc";
import { openDisccusionModal } from "lib/atoms/discussionModal";

function ReportModal() {
	const [data, setData] = useRecoilState(openDisccusionModal);

	const [divHeight, setDivHeight] = useState<number>(0);
	const [firstRender, setFirstRender] = useState<boolean>(true);

	const [displayPage, setDisplayPage] = useState<
		"submission" | "submitSuccess" | "submitFailure"
	>("submission");

	useEffect(() => setFirstRender(false));

	const submitReport = trpc.report.submitReport.useMutation({
		onSuccess() {
			setDisplayPage("submitSuccess");
		},
		onError() {
			setDisplayPage("submitFailure");
		},
		onSettled() {
			setDivHeight(80);
		},
	});

	const submitFunction = (reasons: string[]) => {
		if (!data.type || !data.identifier) throw new Error("Invalid Report Data");
		submitReport.mutate({
			identifier: data.identifier,
			type: data.type,
			reasons: reasons,
		});
	};

	return (
		<Modal
			opened={data.opened}
			onClose={() => {
				setData({
					opened: false,
					identifier: null,
					type: null,
				});
			}}
			withCloseButton={false}
			centered
			size="sm"
			classNames={{ modal: "bg-neutral-50" }}
		>
			{data.type && data.identifier && (
				<motion.div
					className="relative flex w-full scrollbar-hide overflow-x-hidden"
					initial={{ height: 392 }}
					animate={{
						height: divHeight,
					}}
					transition={{ ease: "easeOut" }}
				>
					<AnimatePresence>
						{displayPage === "submission" && (
							<motion.div
								key={0}
								className="absolute top-0 w-full"
								animate={{ x: 0 }}
								initial={{ x: firstRender ? 0 : 400 }}
								transition={{ ease: "easeOut" }}
								exit={{ x: -400 }}
							>
								<ReportMenu
									type={data.type}
									submitFunction={submitFunction}
									setDivHeight={setDivHeight}
									submissionLoading={submitReport.isLoading}
								/>
							</motion.div>
						)}
						{displayPage === "submitSuccess" && (
							<motion.div
								key={1}
								className="absolute top-0 w-full"
								animate={{ x: 0 }}
								initial={{ x: 400 }}
								transition={{ ease: "easeOut" }}
								exit={{ x: -400 }}
							>
								<ReportSuccess />
							</motion.div>
						)}
						{displayPage === "submitFailure" && (
							<motion.div
								key={2}
								className="absolute top-0 w-full"
								animate={{ x: 0 }}
								initial={{ x: 400 }}
								transition={{ ease: "easeOut" }}
								exit={{ x: -400 }}
							>
								<ReportFailure />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</Modal>
	);
}

export default ReportModal;
