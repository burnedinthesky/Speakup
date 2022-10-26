import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { z } from "zod";

import { Button, LoadingOverlay, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import useTimeoutEmail from "../../hooks/navigation/useTimeoutEmail";

import { SignInPageIDs } from "../../types/auth.types";

interface PageProps {
    setDisplayPage: (value: SignInPageIDs) => void;
    setDivHeight: (value: number) => void;
}

const RequestResetPwdPage = ({ setDisplayPage, setDivHeight }: PageProps) => {
    const rootDivRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const [firstRender, setFirstRender] = useState(true);

    const [userEmail, setUserEmail] = useState("");

    useLayoutEffect(() => {
        if (rootDivRef.current && firstRender) setDivHeight(192);
        setFirstRender(false);
    }, []);

    useLayoutEffect(() => {
        if (!firstRender && rootDivRef.current)
            setDivHeight(rootDivRef.current.clientHeight);
    });

    useEffect(() => {
        if (!router.isReady || !router.query.email) return;
        const emailAddr = router.query.email as string;
        setUserEmail(emailAddr);
    }, [router.isReady]);

    const emailTest = z.string().email();

    const submitResendRequest = (email?: string) => {
        emailTest.parse(email ? email : userEmail);
        requestEmailMutation.mutate({
            email: email ? email : userEmail,
        });
    };

    const { emailCD, canSendEmail, resetEmailCD } = useTimeoutEmail({
        localStorageId: "emailcd",
    });

    const requestEmailMutation = trpc.useMutation(["users.sendResetPwdLink"], {
        onSettled: () => {
            resetEmailCD();
        },
    });

    return (
        <div className="relative w-full" ref={rootDivRef}>
            <LoadingOverlay visible={!router.isReady} />
            <h1 className="text-2xl text-primary-500">忘記密碼</h1>
            <p className="mt-2 text-sm text-neutral-700">
                請輸入您用來註冊Speakup帳號的信箱，我們將會寄重設密碼的連結給您。
            </p>

            <p className="mt-2 text-sm text-neutral-700">
                沒收到信件？有時候信件會被誤判為垃圾郵件，因此您也可以去垃圾郵件翻找看看
            </p>

            <div className="relative">
                <LoadingOverlay visible={requestEmailMutation.isLoading} />
                <TextInput
                    className="mt-4"
                    placeholder="您的信箱"
                    value={userEmail}
                    onChange={(e) => {
                        setUserEmail(e.currentTarget.value);
                    }}
                    disabled={!canSendEmail}
                />
                <div className="mt-4 flex items-center gap-2">
                    <Button
                        className="bg-primary-500"
                        onClick={() => {
                            submitResendRequest();
                        }}
                        disabled={
                            !canSendEmail ||
                            !emailTest.safeParse(userEmail).success
                        }
                    >
                        傳送
                    </Button>
                    {emailCD > 0 && (
                        <p className="text-primary-500">
                            未收到信件？{emailCD}秒後再次傳送
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestResetPwdPage;
