import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import Introduction from "../../components/Onboarding/Introduction";
import UserInfo, { UserInfoData } from "../../components/Onboarding/UserInfo";
import InterestedTopics from "../../components/Onboarding/InterestedTopics";
import Comments from "../../components/Onboarding/Comments";
import AllDone from "../../components/Onboarding/AllDone";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { showErrorNotification } from "../../lib/errorHandling";

export interface OnboardingData {
	userInfo: {
		birthTime: Date | null;
		gender: "m" | "f" | "o" | null;
	};
	interestedTopics: {
		topics: string[];
	};
}

const GetAnimProps = (component: string, page: number) => {
	if (component === "title") {
		switch (page) {
			case 0:
				return { scale: 1.1 };
			default:
				return { scale: 0.5 };
		}
	} else if (component === "container") {
		switch (page) {
			case 0:
				return { height: 120 };
			case 1:
			case 2:
				return { height: 300 };
			case 3:
				return { height: 250 };
			case 4:
				return { height: 160 };
			default:
				return { height: 600 };
		}
	}
};

const titles = [
	"歡迎來到Speakup",
	"基本資料",
	"標籤選擇",
	"平台介紹",
	"即將開始",
];

export type PageDataStages = "pendVal" | "validating" | "valPassed";

const UserOnboarding = () => {
	const [currentPage, setCurrentPage] = useState<number>(0);
	const router = useRouter();

	const [pagesData, setPagesData] = useState<{
		userInfo: UserInfoData;
		intTopics: string[] | null;
	}>({
		userInfo: {
			birthYear: undefined,
			birthMonth: undefined,
			gender: undefined,
		},
		intTopics: null,
	});

	const [dataStatus, setDataStatus] = useState<
		Record<"userInfo" | "intTopics", PageDataStages>
	>({
		userInfo: "pendVal",
		intTopics: "pendVal",
	});

	useEffect(() => {
		if (dataStatus.userInfo === "valPassed") {
			setDataStatus((cur) => ({ ...cur, userInfo: "pendVal" }));
			setCurrentPage(2);
		} else if (dataStatus.intTopics === "valPassed") {
			setDataStatus((cur) => ({ ...cur, intTopics: "pendVal" }));
			setCurrentPage(3);
		}
	}, [dataStatus]);

	const onboardMutation = trpc.users.onboard.useMutation({
		onSuccess: () => {
			router.push("/home");
		},
		onError: () => {
			showErrorNotification({
				message: "請再試一次",
			});
		},
	});

	const submitOnboarding = () => {
		if (
			pagesData.userInfo.birthYear === undefined ||
			pagesData.userInfo.birthMonth === undefined ||
			!pagesData.userInfo.gender ||
			!pagesData.intTopics
		)
			throw new Error("Missing required information");

		const birthTime = new Date(
			pagesData.userInfo.birthYear,
			pagesData.userInfo.birthMonth,
			1,
			0,
			0,
			0,
		);

		onboardMutation.mutate({
			birthDate: birthTime,
			gender: pagesData.userInfo.gender,
			interestedTags: pagesData.intTopics,
		});
	};

	return (
		<>
			<Head>
				<title>{"歡迎來到Speakup"}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="manifest" href="/site.webmanifest" />
			</Head>
			<div className="fixed top-0 left-0 flex h-screen w-screen flex-col items-center justify-center bg-white">
				<motion.h1
					className="z-20 bg-white text-4xl text-center font-semibold text-primary-600 sm:text-5xl lg:text-6xl"
					initial={{ scale: 1.8 }}
					animate={{ ...GetAnimProps("title", currentPage) }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					{titles[currentPage]}
				</motion.h1>
				<motion.div className="flex items-center gap-12">
					<button
						className="opacity-100 disabled:opacity-0 hidden md:block"
						disabled={currentPage === 0}
						onClick={() => {
							setCurrentPage((cur) => cur - 1);
						}}
					>
						<ChevronLeftIcon className="w-5" />
					</button>

					<motion.div
						className="relative flex w-screen max-w-sm overflow-hidden"
						initial={{ height: 0 }}
						animate={{ ...GetAnimProps("container", currentPage) }}
						transition={{ ease: "easeOut", duration: 1 }}
					>
						<motion.div
							className="absolute w-full"
							initial={{ y: 0 }}
							animate={{ y: 0 - 500 * currentPage }}
							transition={{ duration: 0.8 }}
						>
							<Introduction />
						</motion.div>
						<motion.div
							className="absolute flex w-full flex-col justify-center"
							initial={{ y: 500 }}
							animate={{ y: 500 - 500 * currentPage }}
							transition={{ duration: 0.8 }}
						>
							<UserInfo
								pageStatus={dataStatus.userInfo}
								setPageStatus={(val: PageDataStages) =>
									setDataStatus((cur) => ({
										...cur,
										userInfo: val,
									}))
								}
								setData={(data) => {
									setPagesData((cur) => ({
										...cur,
										userInfo: data,
									}));
								}}
							/>
						</motion.div>
						<motion.div
							className="absolute flex w-full flex-col justify-center"
							initial={{ y: 1000 }}
							animate={{ y: 1000 - 500 * currentPage }}
							transition={{ duration: 0.8 }}
						>
							<InterestedTopics
								pageStatus={dataStatus.intTopics}
								setPageStatus={(val: PageDataStages) =>
									setDataStatus((cur) => ({
										...cur,
										intTopics: val,
									}))
								}
								setData={(data) => {
									setPagesData((cur) => ({
										...cur,
										intTopics: data,
									}));
								}}
							/>
						</motion.div>
						<motion.div
							className="absolute flex w-full flex-col justify-center"
							initial={{ y: 1500 }}
							animate={{ y: 1500 - 500 * currentPage }}
							transition={{ duration: 0.8 }}
						>
							<Comments />
						</motion.div>
						<motion.div
							className="absolute flex w-full flex-col justify-center"
							initial={{ y: 2000 }}
							animate={{ y: 2000 - 500 * currentPage }}
							transition={{ duration: 0.8 }}
						>
							<AllDone
								isLoading={onboardMutation.isLoading}
								submitOnboard={submitOnboarding}
							/>
						</motion.div>
					</motion.div>
					<button
						className="opacity-100 disabled:opacity-0 hidden md:block"
						disabled={currentPage === 4}
						onClick={() => {
							if ([0, 3].includes(currentPage))
								setCurrentPage((cur) => cur + 1);
							else {
								if (currentPage === 1)
									setDataStatus((cur) => ({ ...cur, userInfo: "validating" }));
								else if (currentPage === 2)
									setDataStatus((cur) => ({ ...cur, intTopics: "validating" }));
							}
						}}
					>
						<ChevronRightIcon className="w-5" />
					</button>
				</motion.div>
				<div className="w-full max-w-xs flex justify-between items-center h-16 md:hidden">
					<button
						className="opacity-100 disabled:opacity-0 w-1/2"
						disabled={currentPage === 0}
						onClick={() => {
							setCurrentPage((cur) => cur - 1);
						}}
					>
						<ChevronLeftIcon className="w-5  mx-auto" />
					</button>
					<button
						className="opacity-100 disabled:opacity-0 w-1/2 "
						disabled={currentPage === 4}
						onClick={() => {
							if ([0, 3].includes(currentPage))
								setCurrentPage((cur) => cur + 1);
							else {
								if (currentPage === 1)
									setDataStatus((cur) => ({ ...cur, userInfo: "validating" }));
								else if (currentPage === 2)
									setDataStatus((cur) => ({ ...cur, intTopics: "validating" }));
							}
						}}
					>
						<ChevronRightIcon className="w-5 mx-auto" />
					</button>
				</div>
			</div>
		</>
	);
};

export default UserOnboarding;
