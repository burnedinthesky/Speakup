import { useState } from "react";

import { Button, Checkbox } from "@mantine/core";
import { ReportConfigs } from "components/Common/Report/ReportMenu/reportConfigs";
import ReportedReason from "./ReportedReason";

interface DeleteReasonDropdownProps {
	id: number;
	type: "argument" | "comment";
	deleteComment: (reasons: string[]) => void;
	cancelDelete?: () => void;
}

const DeleteReasonDropdown = ({
	id,
	type,
	deleteComment,
	cancelDelete,
}: DeleteReasonDropdownProps) => {
	const [violatedRules, setViolatedRules] = useState<string[]>([]);
	const [errors, setErrors] = useState<string | null>(null);

	const submitDecision = () => {
		if (violatedRules.length === 0) {
			setErrors("請至少選取一個原因");
		} else deleteComment(violatedRules);
	};

	return (
		<>
			<div>
				<h3 className="text-sm font-bold">移除原因</h3>
				{errors && <p className="text-xs text-red-500">{errors}</p>}
				<div className="mt-3 flex flex-col gap-1">
					{ReportConfigs[type]?.options.map((option, i) => (
						<Checkbox
							key={i}
							size="sm"
							value={option.key}
							label={option.text}
							checked={violatedRules.includes(option.text)}
							onChange={(e) => {
								if (e.currentTarget.checked)
									setViolatedRules((cur) => [...cur, option.text]);
								else
									setViolatedRules((cur) =>
										cur.filter((rule) => rule !== option.text),
									);
							}}
						/>
					))}
				</div>
			</div>
			<div>
				<div className="flex w-full justify-end gap-2">
					<Button
						size="xs"
						radius="xl"
						color="gray"
						variant="light"
						onClick={cancelDelete ? cancelDelete : close}
					>
						取消
					</Button>
					<Button
						size="xs"
						radius="xl"
						className="bg-primary-600"
						onClick={() => {
							submitDecision();
						}}
					>
						移除
					</Button>
				</div>
				<hr className="my-2 w-full border-b border-b-slate-300 px-3" />
				<ReportedReason id={id} type={type} />
			</div>
		</>
	);
};

export default DeleteReasonDropdown;
