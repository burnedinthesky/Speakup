import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";

import { Button, TextInput, LoadingOverlay } from "@mantine/core";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import useTimeoutEmail from "../../hooks/navigation/useTimeoutEmail";
import { AuthPageProps } from "../../types/auth.types";
import { signIn } from "next-auth/react";

const VerifyEmailPage = ({ setDisplayPage, setDivHeight }: AuthPageProps) => {
    const router = useRouter();
    const rootDivRef = useRef<HTMLDivElement | null>(null);

    const [firstRender, setFirstRender] = useState<boolean>(true);

    const [valcode, setValcode] = useState<string>("");

    const valcodeTest = /^[0-9]{6}$/;
    const [valcodeInputError, setValcodeInputError] = useState<
        string | undefined
    >(undefined);

    const [valId, setValId] = useState<string | null>(null);

    useEffect(() => {
        if (rootDivRef.current && firstRender) setDivHeight(232);
        setFirstRender(false);
        resetEmailCD();
    }, []);

    useEffect(() => {
        if (!firstRender && rootDivRef.current)
            setDivHeight(rootDivRef.current.clientHeight);
    });

    useEffect(() => {
        if (!router.isReady) return;

        if (!router.query.token) {
            setDisplayPage("signup");
        } else {
            setValId(router.query.token as string);
        }
    }, [router.isReady, router.query]);

    const { emailCD, canSendEmail, resetEmailCD } = useTimeoutEmail({
        localStorageId: "r2emailcd",
    });

    const verifyTokenMutation = trpc.useMutation(["users.verifyEmail"], {
        onSuccess: async (data) => {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                additionalParams: "useRawKey",
                callbackUrl: "/user/onboarding",
            });
            if (res?.ok) return;
            else {
                showNotification({
                    message: "註冊成功，請登入",
                });
                router.push("/user/signin");
            }
        },
        onError: (error) => {
            if (error.message === "Failed too many times") {
                setValcodeInputError("驗證錯誤次數過多，註冊失敗");
            } else if (error.message === "Validation failed") {
                setValcodeInputError("驗證碼錯誤");
            } else if (error.message === "Token expired") {
                setValcodeInputError("驗證碼過期，請重新註冊");
            } else if (error.message === "Verifier not found") {
                setValcodeInputError(
                    "系統註冊碼錯誤，請回首頁重新註冊，並讓系統自動重新導向頁面"
                );
            } else {
                showNotification({
                    title: "發生未知的錯誤",
                    message: "請再試一次",
                    color: "red",
                    autoClose: false,
                });
            }
        },
    });

    const resendEmailMutation = trpc.useMutation(["users.resendEmail"], {
        onSettled: () => {
            resetEmailCD();
        },
        onError: (error) => {
            let ntfMsg;
            console.log(error);
            if (error.message == "Verifier not found") {
                ntfMsg =
                    "系統註冊碼錯誤，請回首頁重新註冊，並讓系統自動重新導向頁面";
            } else if (error.message == "Cooling down") {
                ntfMsg = "請等候信件寄送倒數計時";
            } else if (error.message == "Day quota exhausted") {
                ntfMsg =
                    "您寄送的信件過多，請在24小時後再試一次，或聯絡Speakup支援";
            } else {
                ntfMsg = "發生了未知的錯誤，請再試一次";
            }
            showNotification({
                title: "信件寄送失敗",
                message: ntfMsg,
                color: "red",
                autoClose: false,
            });
        },
    });

    const checkToken = () => {
        if (!valId) return;
        verifyTokenMutation.mutate({
            verId: valId,
            verToken: valcode,
        });
        setValcodeInputError(undefined);
    };

    return (
        <>
            <div className="relative w-full" ref={rootDivRef}>
                <LoadingOverlay visible={valId ? false : true} />
                <h1 className="text-2xl text-primary-500">信箱驗證</h1>
                <p className="mt-2 text-sm text-neutral-700">
                    請檢查您的信箱，Speakup有寄送一封含有驗證碼的信給您
                </p>

                <p className="mt-2 text-sm text-neutral-700">
                    沒收到信件？有時候信件會被誤判為垃圾郵件，因此您也可以去垃圾郵件翻找看看
                </p>

                <div className="relative">
                    <LoadingOverlay visible={verifyTokenMutation.isLoading} />
                    <TextInput
                        className="mt-4"
                        placeholder="驗證碼"
                        value={valcode}
                        onChange={(e) => {
                            setValcode(e.currentTarget.value);
                        }}
                        error={valcodeInputError}
                    />
                    <div className=" mt-4 flex items-center gap-2">
                        <Button
                            className="bg-primary-500"
                            onClick={checkToken}
                            disabled={
                                !valcodeTest.test(valcode) ||
                                valcodeInputError ==
                                    "驗證錯誤次數過多，註冊失敗"
                            }
                        >
                            驗證
                        </Button>
                        {emailCD > 0 && (
                            <p className="text-primary-500">
                                未收到信件？{emailCD}秒後再次傳送
                            </p>
                        )}
                        {canSendEmail && (
                            <button
                                onClick={() => {
                                    if (!valId)
                                        throw new Error("Val ID not provided");
                                    resendEmailMutation.mutate({
                                        verId: valId,
                                    });
                                }}
                            >
                                <p className="text-primary-500">再次傳送</p>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmailPage;
