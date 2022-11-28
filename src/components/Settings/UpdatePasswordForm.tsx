import { Button, LoadingOverlay, PasswordInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { signOut } from "next-auth/react";
import { z } from "zod";
import { passwordSchema } from "../../types/auth.types";
import { trpc } from "../../utils/trpc";

const UpdatePasswordForm = () => {
    const pwdFormSchema = z.object({
        oldPwd: z.string(),
        newPwd: passwordSchema,
        valPwd: z.string(),
    });

    const pwdForm = useForm({
        initialValues: {
            oldPwd: "",
            newPwd: "",
            valPwd: "",
        },
        validate: zodResolver(pwdFormSchema),
    });

    const resetPasswordMutation = trpc.users.resetPwd.useMutation({
        onSuccess: async (data) => {
            showNotification({
                message: "密碼變更成功，請登入",
            });
            await signOut();
        },
        onError: (error) => {
            if (error.message === "Password same as previous") {
                pwdForm.setErrors({ newPwd: "密碼不能與之前的相同" });
            } else if (error.message === "Current password incorrect") {
                pwdForm.setErrors({ oldPwd: "密碼不正確" });
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

    const submitResetForm = () => {
        if (!pwdForm.isValid()) return;

        const { oldPwd, newPwd, valPwd } = pwdForm.values;

        if (newPwd !== valPwd) {
            pwdForm.setErrors({
                valpwd: "密碼不一致",
            });
            return;
        }

        resetPasswordMutation.mutate({
            oldPwd: oldPwd,
            password: newPwd,
        });
    };

    return (
        <div className="relative w-full bg-white px-4 py-6">
            <h1 className="text-lg text-primary-500">重設密碼</h1>
            <form className="relative">
                <LoadingOverlay visible={resetPasswordMutation.isLoading} />
                <PasswordInput
                    className="mt-2"
                    label="現有密碼"
                    {...pwdForm.getInputProps("oldPwd")}
                />
                <PasswordInput
                    className="mt-2"
                    label="新的密碼"
                    description="密碼必須含有一個大寫字母、小寫字母以及一個數字"
                    {...pwdForm.getInputProps("newPwd")}
                />
                <PasswordInput
                    className="mt-2"
                    label="再次輸入密碼"
                    {...pwdForm.getInputProps("valPwd")}
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
    );
};

export default UpdatePasswordForm;
