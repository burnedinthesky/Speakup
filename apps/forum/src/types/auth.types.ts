import { z } from "zod";

export type SignUpPageIDs = "signup" | "verifyEmail";
export type SignInPageIDs = "signin" | "reqResetPwd" | "resetEmailSent";

export type AuthPageProps = {
	setDisplayPage: (value: SignUpPageIDs) => void;
	setDivHeight: (value: number) => void;
};
