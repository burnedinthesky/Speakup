import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";

import { Button, LoadingOverlay, PasswordInput } from "@mantine/core";

import { useRouter } from "next/router";
import { useForm, zodResolver } from "@mantine/form";
import { passwordSchema } from "../../../types/auth.types";

const ResetPwd = () => {
    const router = useRouter();

    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        if (router.isReady) {
            const token = router.query.token;
            if (!token) router.push("/user/login");
            setAuthToken(token as string);
        }
    }, [router.isReady]);

    const resetPasswordMutation = trpc.users.resetPwd.useMutation({
        onSuccess: async (data) => {
            console.log("success");
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                additionalParams: "useRawKey",
                callbackUrl: "/home",
            });
            if (res?.ok) return;
            else {
                showNotification({
                    message: "密碼修改成功，請登入",
                });
                router.push("/user/signin");
            }
        },
        onError: (error) => {
            if (error.message === "Token not found")
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
                newpwd: passwordSchema,
                valpwd: z.string(),
            })
        ),
    });

    const submitResetForm = () => {
        if (!pwdForm.isValid()) return;

        const { newpwd, valpwd } = pwdForm.values;

        if (newpwd !== valpwd) {
            pwdForm.setErrors({
                valpwd: "密碼不一致",
            });
            return;
        }
        if (!authToken) throw new Error("Token not found");

        resetPasswordMutation.mutate({
            token: authToken,
            password: newpwd,
        });
    };

    return (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50">
            <div className="relative mx-8 w-full max-w-md overflow-hidden rounded-3xl bg-white py-14 px-10">
                <LoadingOverlay visible={authToken ? false : true} />
                <h1 className="text-2xl text-primary-500">重設密碼</h1>
                <form className="relative">
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
                    <Button
                        onClick={() => {
                            console.log("faa");
                            submitResetForm();
                        }}
                        className="mt-2 bg-primary-500"
                    >
                        修改
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPwd;
