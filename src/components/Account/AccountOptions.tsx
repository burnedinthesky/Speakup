import {
    CogIcon,
    ChevronDownIcon,
    LogoutIcon,
    MicrophoneIcon,
    UserCircleIcon,
} from "@heroicons/react/outline";
import { Avatar, Menu } from "@mantine/core";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { CheckAvcClearance } from "../../types/advocate/user.types";

const AccountOptions = () => {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <Menu position="bottom-end">
            <Menu.Target>
                <button>
                    <div className="block lg:hidden">
                        <Avatar
                            src={session?.user.profileImg}
                            radius="xl"
                            size="sm"
                            color="cyan"
                        >
                            {session?.user.name[0]}
                        </Avatar>
                    </div>
                    <div className="hidden items-center gap-2 rounded-3xl bg-primary-400 py-2 px-3 text-neutral-800 lg:flex">
                        <Avatar
                            src={session?.user.profileImg}
                            radius="xl"
                            size="sm"
                        >
                            {session?.user.name[0]}
                        </Avatar>
                        <p className="ml-2 mr-1 whitespace-nowrap text-white">
                            {session?.user?.name}
                        </p>
                        <ChevronDownIcon className="h-4 w-4 text-white" />
                    </div>
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    className="text-primary-900"
                    icon={<UserCircleIcon className="h-7 w-7" />}
                    onClick={() => {
                        router.push(`/user/${session?.user.id}`);
                    }}
                >
                    帳戶
                </Menu.Item>
                <Menu.Item
                    className="text-primary-900"
                    icon={<CogIcon className="h-7 w-7" />}
                    onClick={() => {
                        router.push("/user/settings");
                    }}
                >
                    設定
                </Menu.Item>
                {CheckAvcClearance(session?.user.role) && (
                    <Menu.Item
                        className="text-primary-900"
                        icon={<MicrophoneIcon className="h-7 w-7" />}
                        onClick={() => {
                            router.push("/advocate");
                        }}
                    >
                        倡議
                    </Menu.Item>
                )}
                <Menu.Item
                    className="text-primary-900"
                    icon={<LogoutIcon className="h-7 w-7" />}
                    onClick={() => {
                        signOut({
                            callbackUrl: "/user/signin",
                        });
                    }}
                >
                    登出
                </Menu.Item>
                <Menu.Label>Speakup Indev 0.0.1</Menu.Label>
            </Menu.Dropdown>
        </Menu>
    );
};

export default AccountOptions;
