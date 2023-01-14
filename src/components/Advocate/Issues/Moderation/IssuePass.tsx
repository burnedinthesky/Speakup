import { Button, Checkbox, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { showErrorNotification } from "lib/errorHandling";
import { trpc } from "utils/trpc";

const IssuePassPanel = ({ articleId }: { articleId: string }) => {
	const [checkedVals, setCheckedVals] = useState<number[]>([]);
	const [error, setError] = useState<string | null>(null);
	const checkReasons = [
		"具有公眾討論的價值",
		"沒有偏袒某一立場",
		"沒有包含假訊息",
	];

	const router = useRouter();

	const passedMutation = trpc.advocate.articles.moderationPassed.useMutation({
		onSuccess: () => {
			showNotification({
				title: "提交成功",
				message: "我們正在為您重新導向頁面",
			});
			router.push("/advocate/issues/moderate");
		},
		onError: () => {
			showErrorNotification({
				message: "請再試一次",
			});
		},
	});

	return (
		<div className="relative mt-4 w-full">
			<LoadingOverlay visible={passedMutation.isLoading} />
			<h2 className="font-bold">我確定本文章</h2>
			{error && <p className=" text-sm text-red-500">{error}</p>}
			<div className="mt-4 flex flex-col gap-2">
				{checkReasons.map((reason, i) => (
					<Checkbox
						key={i}
						checked={checkedVals.includes(i)}
						onChange={(e) => {
							if (e.currentTarget.checked) setCheckedVals((cur) => [...cur, i]);
							else setCheckedVals((cur) => cur.filter((ele) => ele !== i));
						}}
						value={i.toString()}
						label={reason}
					/>
				))}
			</div>
			<div className="ml-auto mt-4">
				<Button
					onClick={() => {
						setError(null);
						if (checkedVals.length < checkReasons.length) {
							setError("請確認議題符合所有標準，或是選擇駁回議題審核申請");
							return;
						}

						passedMutation.mutate({ id: articleId });
					}}
					variant="outline"
				>
					提交
				</Button>
			</div>
		</div>
	);
};

export default IssuePassPanel;
