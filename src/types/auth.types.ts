import { z } from "zod";

export type SignUpPageIDs = "signup" | "verifyEmail";
export type SignInPageIDs = "signin" | "reqResetPwd" | "resetEmailSent";

export type AuthPageProps = {
    setDisplayPage: (value: SignUpPageIDs) => void;
    setDivHeight: (value: number) => void;
};

export const passwordSchema = z
    .string()
    .min(10, "密碼需至少包含十個字元")
    .regex(/[A-Z]/, "密碼必須含有一個大寫字母")
    .regex(/[a-z]/, "密碼必須含有一個小寫字母")
    .regex(/[0-9]/, "密碼必須含有一個數字");
