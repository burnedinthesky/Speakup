import React from "react";

import {
    CogIcon,
    InformationCircleIcon,
    LogoutIcon,
    PencilAltIcon,
    ChevronDownIcon,
    HomeIcon,
    UserCircleIcon,
} from "@heroicons/react/outline";
import { Menu } from "@mantine/core";
import { useRouter } from "next/router";
// import { signOut, useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";

const AccountOptions = () => {
    const router = useRouter();
    // const { data: session } = useSession();

    const inAdmin = router.pathname.split("/")[1] == "admin";

    const logout = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
                // Authorization: `Token ${session.authToken}`,
            },
        }).then((response) => {
            if (response.status === 204) {
                // signOut();
            } else
                showNotification({
                    title: "登出失敗",
                    message: "請再試一次",
                    color: "red",
                    autoClose: false,
                });
        });
    };

    return (
        <Menu
            control={
                <button className="">
                    <UserCircleIcon className="h-8 w-8 lg:hidden" />
                    <div className=" hidden items-center gap-2 rounded-3xl bg-primary-400 py-2 px-3 text-neutral-800 lg:flex">
                        {/* <div className="h-7 w-7 overflow-hidden rounded-full">
                                    <img
                                        className="h-full"
                                        src={session?.user?.image}
                                        alt="pfp"
                                    />
                                </div> */}
                        <UserCircleIcon className="w7- h-7 text-white" />
                        {/* <p className="">{session?.user?.name}</p> */}
                        <ChevronDownIcon className="h-4 w-4" />
                    </div>
                </button>
            }
            position="bottom"
            placement="end"
        >
            {/* {["creator", "seniorcr", "coop"].includes(session?.role) && (
                <Menu.Item
                    className="text-primary-900"
                    icon={inAdmin ? <HomeIcon className="h-7 w-7" /> : <PencilAltIcon className="h-7 w-7" />}
                    onClick={() => {
                        router.push(inAdmin ? "/home" : "/admin");
                    }}
                >
                    {inAdmin ? "Speakup首頁" : "創作者介面"}
                </Menu.Item>
            )} */}
            <Menu.Item
                className="text-primary-900"
                icon={<CogIcon className="h-7 w-7" />}
                onClick={() => {
                    router.push("/user/settings");
                }}
            >
                設定
            </Menu.Item>
            <a href="https://speakup-team.notion.site/Speakup-ff4943ac425a430ebc06e74982d18968" target="_blank" rel="norefferer noopener">
                <Menu.Item className="text-primary-900" icon={<InformationCircleIcon className="h-7 w-7" />}>
                    關於
                </Menu.Item>
            </a>

            <Menu.Item className="text-primary-900" icon={<LogoutIcon className="h-7 w-7" />} onClick={logout}>
                登出
            </Menu.Item>
            <Menu.Label>Speakup Alpha 0.1.0</Menu.Label>
        </Menu>
    );
};

export default AccountOptions;
