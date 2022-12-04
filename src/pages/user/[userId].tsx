import { GetServerSideProps } from "next";
import { prisma } from "../../utils/prisma";
import { AppShell } from "../../components/AppShell";
import { Avatar } from "@mantine/core";
import UserFeed from "../../components/User/Feed/UserFeed";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import ReputationExpModal from "../../components/User/Feed/ReputationExpModal";
import ReputationBar from "../../components/User/Reputation/ReputationBar";

interface UserData {
    id: string;
    name: string;
    profile: string | null;
    arguments: number;
    comments: number;
    articles: number;
    reputation: number;
}

const UserProfilePage = ({ userData }: { userData: UserData }) => {
    const [openRegExpModal, setOpenRegExpModal] = useState<boolean>(false);

    return (
        <AppShell title={`Speakup - ${userData.name}`} navbarRetractable={true}>
            <div className="mx-auto my-24 w-full max-w-4xl rounded-lg bg-neutral-50 py-10 px-12">
                <div className="flex w-full flex-col items-center">
                    <Avatar
                        src={userData.profile}
                        alt="使用者頭像 "
                        size={80}
                        radius={800}
                        color="cyan"
                    >
                        {userData.name[0]}
                    </Avatar>
                    <h1 className="mt-5 text-2xl font-bold text-primary-800">
                        {userData.name}
                    </h1>
                    <div className="mt-3 flex items-center gap-2">
                        <h3>聲望</h3>
                        <button
                            onClick={() => {
                                setOpenRegExpModal(true);
                            }}
                        >
                            <QuestionMarkCircleIcon className="h-4 text-neutral-700" />
                        </button>
                    </div>
                    <ReputationBar reputation={userData.reputation} />
                    <p className="mt-3 text-neutral-700">
                        <span className="inline-block">
                            {userData.arguments}個論點
                        </span>
                        ・
                        <span className="inline-block">
                            {userData.comments}則回覆
                        </span>
                        ・
                        <span className="inline-block">
                            {userData.articles}篇議題
                        </span>
                    </p>
                </div>
                <UserFeed userId={userData.id} userName={userData.name} />
                <ReputationExpModal
                    opened={openRegExpModal}
                    setOpened={setOpenRegExpModal}
                />
            </div>
        </AppShell>
    );
};

export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context?.params?.userId as string;

    console.log(userId);

    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            profileImg: true,
            name: true,
            reputation: true,
            _count: {
                select: {
                    arguments: true,
                    comments: true,
                    articles: true,
                },
            },
        },
    });

    console.log(userProfile);

    if (!userProfile) {
        return {
            notFound: true,
        };
    }

    const data: UserData = {
        id: userId,
        name: userProfile.name,
        profile: userProfile.profileImg,
        arguments: userProfile._count.arguments,
        comments: userProfile._count.comments,
        articles: userProfile._count.articles,
        reputation: userProfile.reputation,
    };

    return {
        props: { userData: data },
    };
};
