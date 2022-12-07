import { Button, LoadingOverlay, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { showErrorNotification } from "../../../../lib/errorHandling";
import { trpc } from "../../../../utils/trpc";

const IssueFailedPanel = ({ articleId }: { articleId: string }) => {
    const [error, setError] = useState<string | null>(null);

    const taRef = useRef<HTMLTextAreaElement | null>(null);
    const router = useRouter();

    const failedMutation = trpc.advocate.articles.moderationFailed.useMutation({
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
            <LoadingOverlay visible={failedMutation.isLoading} />
            <h2 className="font-bold">不通過的原因</h2>
            {error && <p className=" text-sm text-red-500">{error}</p>}
            <Textarea ref={taRef} className="mt-4" autosize minRows={2} />
            <div className="ml-auto mt-4">
                <Button
                    onClick={() => {
                        setError(null);
                        let reason = taRef.current?.value;
                        if (reason === undefined || reason.length < 50) {
                            setError("請詳盡描述原因");
                            return;
                        }
                        failedMutation.mutate({
                            id: articleId,
                            reason: reason,
                        });
                    }}
                    variant="outline"
                >
                    提交
                </Button>
            </div>
        </div>
    );
};

export default IssueFailedPanel;
