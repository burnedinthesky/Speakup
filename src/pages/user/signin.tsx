import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

import RequestResetPwdPage from "../../components/Auth/ResetPasswordForm";
import { SignInPageIDs } from "../../types/auth.types";
import SignInPage from "../../components/Auth/SignInForm";

const SignIn = () => {
	const router = useRouter();
	const [displayPage, setDisplayPage] = useState<SignInPageIDs>("signin");
	const [divHeight, setDivHeight] = useState<number>(312);
	const [firstRender, setFirstRender] = useState<boolean>(true);

	useEffect(() => {
		setFirstRender(false);
	}, []);

	useEffect(() => {
		if (!router.isReady) return;
		const query = router.query;
		if (query.forgotPassword === "t") {
			setDisplayPage("reqResetPwd");
		} else {
			setDisplayPage("signin");
		}
	}, [router.isReady, router.query]);

	return (
		<>
			<Head>
				<title>{"Speakup 登入"}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50 overflow-x-hidden">
				<div className="mx-8 w-full max-w-sm overflow-hidden rounded-lg bg-white py-14 px-8 shadow-lg">
					<motion.div
						className="flex w-full"
						initial={{ height: divHeight }}
						animate={{
							height: divHeight,
						}}
						transition={{ ease: "easeOut" }}
					>
						<AnimatePresence>
							{displayPage === "signin" && (
								<motion.div
									key={0}
									className="w-full"
									animate={{ x: 0 }}
									initial={{ x: firstRender ? 0 : 512 }}
									transition={{
										ease: "easeOut",
									}}
									exit={{ x: -512 }}
								>
									<SignInPage
										setDisplayPage={setDisplayPage}
										setDivHeight={setDivHeight}
									/>
								</motion.div>
							)}
							{displayPage === "reqResetPwd" && (
								<motion.div
									key={1}
									className="w-full"
									animate={{ x: 0 }}
									initial={{ x: 512 }}
									transition={{
										delay: 0.1,
										ease: "easeOut",
									}}
									exit={{ x: -512 }}
								>
									<RequestResetPwdPage
										setDisplayPage={setDisplayPage}
										setDivHeight={setDivHeight}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</>
	);
};

export default SignIn;
