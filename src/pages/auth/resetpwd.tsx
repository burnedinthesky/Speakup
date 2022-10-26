import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
    Button,
    LoadingOverlay,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "react-query";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../../utils/trpc";
import { z } from "zod";

const ResetPwd = () => {
    const router = useRouter();

    const [emailCD, setEmailCD] = useState(0);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const emailCDInterval = useRef<NodeJS.Timer | null>();

    const emailTest =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const pwdTest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    useEffect(() => {
        if (router.isReady) {
            const token = router.query.token;
            if (!token) router.push("/auth/login");
            setAuthToken(token as string);
        }
    }, [router.isReady]);

    useEffect(() => {
        const lsEmailCD = localStorage.getItem("emailcd");
        if (lsEmailCD) {
            if (!emailCDInterval.current)
                emailCDInterval.current = setInterval(updateEmailCD, 1000);
            setEmailCD(parseInt(lsEmailCD));
            setEmailSent(true);
        }
    }, []);

    const updateEmailCD = () => {
        const lsEmailCD = localStorage.getItem("emailcd");
        if (lsEmailCD) {
            let newval = parseInt(lsEmailCD) - 1;
            if (newval == 0) {
                if (emailCDInterval.current)
                    clearInterval(emailCDInterval.current);
                emailCDInterval.current = null;
                localStorage.removeItem("emailcd");
            } else {
                localStorage.setItem("emailcd", newval.toString());
            }
            setEmailCD(newval);
        }
    };

    const requestEmailMutation = useMutation(
        (values) =>
            fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgotPassword`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            ),
        {
            onSettled: () => {
                localStorage.setItem("emailcd", "60");
                setEmailCD(60);
                setEmailSent(true);
                if (!emailCDInterval.current) {
                    emailCDInterval.current = setInterval(updateEmailCD, 1000);
                }
            },
        }
    );

    const resetPasswordMutation = trpc.useMutation(["users.resetPwd"], {
        onSuccess: (data) => {
            showNotification({
                title: "密碼重設成功",
                message: "請重新登入",
            });
            router.push("/login");
        },
        onError: (error) => {
            if (error.message === "Reset key invalid")
                showNotification({
                    title: "發生錯誤",
                    message: "請確定您的網址完全與信中網址完全相同",
                    color: "red",
                    autoClose: false,
                });
            else if (error.message === "Password same as previous") {
                pwdForm.setErrors({ newpwd: "密碼不能與之前的相同" });
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

    const pwdForm = useForm({
        initialValues: {
            newpwd: "",
            valpwd: "",
        },
        validate: zodResolver(
            z.object({
                password: z
                    .string()
                    .min(10, "密碼需至少包含十個字元")
                    .regex(
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/,
                        "密碼必須含有一個大寫字母、小寫字母以及一個數字"
                    ),
            })
        ),
    });

    return (
        <div className=" fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50">
            <form
                className="relative mx-8 w-full max-w-lg rounded-3xl bg-white py-14 px-12"
                onSubmit={pwdForm.onSubmit((values) => {
                    if (values.newpwd !== values.valpwd) {
                        pwdForm.setErrors({
                            valpwd: "密碼不一致",
                        });
                    }
                    if (!authToken) throw new Error("Token not found");
                    resetPasswordMutation.mutate({
                        token: authToken,
                        password: values.newpwd,
                    });
                })}
            >
                <LoadingOverlay visible={authToken ? false : true} />
                <h1 className="text-2xl text-primary-500">重設密碼</h1>
                <div className="relative">
                    <LoadingOverlay visible={resetPasswordMutation.isLoading} />
                    <PasswordInput
                        className="mt-2"
                        label="新的密碼"
                        description="密碼必須含有一個大寫字母、小寫字母以及一個數字"
                        {...pwdForm.getInputProps("newpwd")}
                    />
                    <PasswordInput
                        className="mt-2"
                        label="再次輸入密碼"
                        {...pwdForm.getInputProps("valpwd")}
                    />
                    <Button className="mt-2 bg-primary-500" type="submit">
                        修改
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ResetPwd;
