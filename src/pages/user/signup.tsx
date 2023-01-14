import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

import SignUpPage from "components/Auth/SignUpForm";
import VerifyEmailPage from "components/Auth/VerifyEmailForm";
import type { SignUpPageIDs } from "types/auth.types";

const SignUp = () => {
	const router = useRouter();

	const [displayPage, setDisplayPage] = useState<SignUpPageIDs>("signup");
	const [divHeight, setDivHeight] = useState<number>(0);
	const [firstRender, setFirstRender] = useState<boolean>(true);

	useEffect(() => {
		setFirstRender(false);
	}, []);

	useEffect(() => {
		if (router.query.token) setDisplayPage("verifyEmail");
	}, [router.isReady]);

	return (
		<>
			<Head>
				<title>{"Speakup 註冊"}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-primary-50">
				<div className="mx-8 w-full max-w-md overflow-hidden rounded-lg bg-white py-14 px-8 shadow-lg">
					<motion.div
						className="flex w-full"
						initial={{ height: 518 }}
						animate={{
							height: divHeight,
						}}
						transition={{ ease: "easeOut" }}
					>
						<AnimatePresence>
							{displayPage === "signup" && (
								<motion.div
									key={0}
									className="w-full"
									animate={{ x: 0 }}
									initial={{ x: firstRender ? 0 : 512 }}
									transition={{ ease: "easeOut" }}
									exit={{ x: -512 }}
								>
									<SignUpPage
										setDisplayPage={setDisplayPage}
										setDivHeight={setDivHeight}
									/>
								</motion.div>
							)}
							{displayPage === "verifyEmail" && (
								<motion.div
									key={1}
									className="w-full"
									animate={{ x: 0 }}
									initial={{ x: 512 }}
									transition={{ delay: 0.1, ease: "easeOut" }}
									exit={{ x: -512 }}
								>
									<VerifyEmailPage
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

export default SignUp;
