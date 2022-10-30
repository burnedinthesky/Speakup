import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Introduction from "../../../components/Onboarding/Introduction";
import UserInfo from "../../../components/Onboarding/UserInfo";
import InterestedTopics from "../../../components/Onboarding/InterestedTopics";
import Comments from "../../../components/Onboarding/Comments";
import AllDone from "../../../components/Onboarding/AllDone";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";

export interface OnboardingData {
    userInfo: {
        birthTime: Date | null;
        gender: "m" | "f" | "o" | null;
    };
    interestedTopics: {
        topics: string[];
    };
}

const UserOnboarding = () => {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [animDirection, setAnimDirection] = useState<"prev" | "next">("next");
    const [onBoardingInfo, setOnBoardingInfo] = useState<OnboardingData>({
        userInfo: {
            birthTime: null,
            gender: null,
        },
        interestedTopics: {
            topics: [],
        },
    });

    const prevPage = () => {
        setAnimDirection("prev");
        setCurrentPage((cur) => cur - 1);
    };

    const nextPage = () => {
        setAnimDirection("next");
        setCurrentPage((cur) => cur + 1);
    };

    const onboardMutation = trpc.useMutation(["users.onboard"], {
        onSuccess: () => {
            router.push("/home");
        },
        onError: () => {
            showNotification({
                color: "red",
                title: "發生錯誤",
                message: "請再試一次",
            });
        },
    });

    const submitOnboarding = () => {
        if (
            !onBoardingInfo.userInfo.birthTime ||
            !onBoardingInfo.userInfo.gender
        )
            throw new Error("Missing required information");

        onboardMutation.mutate({
            birthDate: onBoardingInfo.userInfo.birthTime,
            gender: onBoardingInfo.userInfo.gender,
        });
    };

    const OnboardingPages: ReactNode[] = [
        <Introduction nextPage={nextPage} key="intro" />,
        <UserInfo
            key="uinfo"
            prevPage={prevPage}
            nextPage={nextPage}
            setData={(birthTime: Date, gender: "m" | "f" | "o") => {
                setOnBoardingInfo((cur) => ({
                    ...cur,
                    userInfo: {
                        birthTime: birthTime,
                        gender: gender,
                    },
                }));
            }}
        />,
        <InterestedTopics
            key="itopics"
            prevPage={prevPage}
            nextPage={nextPage}
            setData={(values: string[]) => {
                setOnBoardingInfo((cur) => ({
                    ...cur,
                    interestedTopics: {
                        topics: values,
                    },
                }));
            }}
        />,
        <Comments key="comments" prevPage={prevPage} nextPage={nextPage} />,
        <AllDone
            key="alldone"
            prevPage={prevPage}
            nextPage={submitOnboarding}
            isLoading={onboardMutation.isLoading}
        />,
    ];

    const movementX = animDirection === "next" ? 576 : -576;

    return (
        <>
            <Head>
                <title>{"歡迎來到Speakup"}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <div className="fixed top-0 left-0 h-screen w-screen bg-primary-700">
                <div className="fixed top-0 left-0 h-screen w-full max-w-xl bg-neutral-100 overflow-x-hidden">
                    <AnimatePresence>
                        {OnboardingPages.map((page, i) => {
                            if (currentPage === i)
                                return (
                                    <motion.div
                                        key={i}
                                        className="absolute top-0 h-full w-full px-14 pt-24 pb-14"
                                        initial={{
                                            x: movementX,
                                        }}
                                        animate={{ x: 0 }}
                                        exit={{
                                            x: -movementX,
                                        }}
                                        transition={{ ease: "easeOut" }}
                                    >
                                        {page}
                                    </motion.div>
                                );
                        })}
                    </AnimatePresence>
                </div>
            </div>
            ;
        </>
    );
};

export default UserOnboarding;
