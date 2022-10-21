import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { trpc } from "../../utils/trpc";
import { z } from "zod";

import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { UserIcon, InboxIcon, LockClosedIcon } from "@heroicons/react/outline";

import { AppShell } from "../../components/AppShell";
import Head from "next/head";

const SignUp = () => {
    const router = useRouter();

    const hash = (text: string) => {
        const utf8 = new TextEncoder().encode(text);
        return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((bytes) => bytes.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        });
    };

    const signupMutation = trpc.useMutation(["users.registerUser"], {
        onSuccess: (data) => {
            router.push(`/auth/verifyemail?token=${data}`);
        },
        onError: (error) => {
            if (error.message === "Email registered") {
                signupForm.setErrors({
                    email: "此信箱已註冊過，請登入",
                });
            } else if (error.message === "Username taken") {
                signupForm.setErrors({
                    username: "使用者名稱已被使用過",
                });
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

    const signupForm = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confPwd: "",
        },
        validate: zodResolver(
            z.object({
                username: z.string().min(2, "名稱過短").max(16, "名稱過長"),
                email: z.string().email("信箱格式錯誤"),
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

    const submitForm = async (values: {
        username: string;
        email: string;
        password: string;
        confPwd: string;
    }) => {
        if (values.password !== values.confPwd) {
            signupForm.setErrors({
                confPwd: "密碼不相同",
            });
            return;
        }

        const hashedPwd = await hash(values.password);

        signupMutation.mutate({
            name: values.username,
            email: values.email,
            password: hashedPwd,
        });
    };

    return (
        <>
            <Head>
                <title>{"Speakup 註冊"}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50">
                <div className="mx-8 w-full max-w-lg rounded-3xl bg-white py-14 px-12">
                    <div className="flex w-full items-center justify-center gap-2">
                        <h1 className="text-2xl">歡迎加入</h1>
                        <img
                            className="h-7 w-7"
                            src="/assets/logo-mic.svg"
                            alt=""
                        />
                    </div>
                    <p className="mt-3 text-center">
                        請輸入您的資料
                        <br />
                        註冊過了？
                        <Link href="/auth/login">
                            <span className="cursor-pointer text-primary-600">
                                登入
                            </span>
                        </Link>
                    </p>
                    <form
                        className="relative mt-11 flex flex-col gap-4"
                        onSubmit={signupForm.onSubmit(submitForm)}
                    >
                        <LoadingOverlay visible={signupMutation.isLoading} />
                        <TextInput
                            label="您的使用者名稱"
                            placeholder="您的使用者名稱"
                            description="使用者名稱需介於2到16個字元間"
                            icon={
                                <UserIcon className="h-6 w-6 text-primary-600" />
                            }
                            required
                            {...signupForm.getInputProps("username")}
                        />
                        <TextInput
                            label="您的信箱"
                            placeholder="您的信箱"
                            icon={
                                <InboxIcon className="h-6 w-6 text-primary-600" />
                            }
                            required
                            {...signupForm.getInputProps("email")}
                        />
                        <PasswordInput
                            placeholder="您的密碼"
                            label="您的密碼"
                            description="密碼必須含有一個大寫字母、小寫字母以及一個數字"
                            icon={
                                <LockClosedIcon className="h-6 w-6 text-primary-600" />
                            }
                            required
                            {...signupForm.getInputProps("password")}
                        />
                        <PasswordInput
                            label="驗證密碼"
                            placeholder="驗證密碼"
                            icon={
                                <LockClosedIcon className="h-6 w-6 text-primary-600" />
                            }
                            required
                            {...signupForm.getInputProps("confPwd")}
                        />
                        <Button
                            className="bg-primary-600 hover:bg-primary-700"
                            type="submit"
                        >
                            註冊
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
