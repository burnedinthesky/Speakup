import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../../utils/trpc";

import { Button, TextInput, LoadingOverlay } from "@mantine/core";
import Head from "next/head";

const VerifyEmail = () => {
    const router = useRouter();

    const [emailCD, setEmailCD] = useState<number>(60);
    const [valcode, setValcode] = useState<string>("");

    const emailCDInterval = useRef<NodeJS.Timer | null>();

    const valcodeTest = /^[0-9]{6}$/;
    const [valcodeInputError, setValcodeInputError] = useState<
        string | undefined
    >(undefined);

    const [valId, setValId] = useState<string | null>(null);

    useEffect(() => {
        if (router.isReady) {
            if (!router.query.token) {
                router.push("/signup");
            } else {
                setValId(router.query.token as string);
            }
        }
    }, [router.isReady]);

    useEffect(() => {
        const p2emailcd = localStorage.getItem("p2emailcd");

        if (p2emailcd) {
            if (!emailCDInterval.current)
                emailCDInterval.current = setInterval(updateEmailCD, 100);
            setEmailCD(parseInt(p2emailcd));
        } else {
            localStorage.setItem("p2emailcd", "60");
            if (!emailCDInterval.current)
                emailCDInterval.current = setInterval(updateEmailCD, 100);
            setEmailCD(60);
        }
    }, []);

    const updateEmailCD = () => {
        const p2emailcd = localStorage.getItem("p2emailcd");
        if (p2emailcd) {
            let newval = parseInt(p2emailcd) - 1;
            if (newval == 0) {
                if (emailCDInterval.current)
                    clearInterval(emailCDInterval.current);
                emailCDInterval.current = null;
                localStorage.removeItem("p2emailcd");
            } else {
                localStorage.setItem("p2emailcd", newval.toString());
            }
            setEmailCD(newval);
        }
    };

    const verifyTokenMutation = trpc.useMutation(["users.verifyEmail"], {
        onSuccess: (data) => {
            //Todo: Redirect User
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
            localStorage.setItem("p2emailcd", "60");
            setEmailCD(60);
            if (!emailCDInterval.current) {
                emailCDInterval.current = setInterval(updateEmailCD, 100);
            }
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
            <Head>
                <title>{"Speakup 驗證信箱"}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50">
                <div className="relative mx-8 w-full max-w-lg rounded-3xl bg-white py-14 px-12">
                    <LoadingOverlay visible={valId ? false : true} />
                    <h1 className="text-2xl text-primary-500">信箱驗證</h1>
                    <p className="mt-2 text-neutral-700">
                        請檢查您用來註冊的信箱，Speakup有寄送一封有驗證碼的信給您
                    </p>

                    <p className="mt-2 text-neutral-700">
                        沒收到信件？有時候信件會被誤判為垃圾郵件，因此您也可以去垃圾郵件翻找看看
                    </p>

                    <div className="relative">
                        <LoadingOverlay
                            visible={verifyTokenMutation.isLoading}
                        />
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
                            {emailCD <= 0 && (
                                <button
                                    onClick={() => {
                                        if (!valId)
                                            throw new Error(
                                                "Val ID not provided"
                                            );
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
            </div>
        </>
    );
};

export default VerifyEmail;
