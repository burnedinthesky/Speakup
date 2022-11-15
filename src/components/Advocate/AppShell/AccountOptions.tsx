import { ChevronLeftIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Avatar, Menu } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AccountOptions = () => {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <Menu
            position="top"
            classNames={{
                item: "w-[198px] text-slate-500",
            }}
        >
            <Menu.Target>
                <button className="absolute bottom-10 left-6 right-6 flex w-[calc(100%-48px)] items-center justify-between gap-2 overflow-hidden rounded-md border border-slate-200 p-3">
                    <div className="flex items-center gap-3">
                        <Avatar src={session?.user.profileImg} radius="xl">
                            {session?.user.name[0]}
                        </Avatar>
                        <p className="w-28 break-words text-left text-sm text-slate-500">
                            {session?.user.name}
                        </p>
                    </div>
                    <ChevronUpIcon className="w-3 flex-shrink-0" />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    icon={<ChevronLeftIcon className="w-4" />}
                    onClick={() => {
                        router.push("/home");
                    }}
                >
                    返回Speakup
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default AccountOptions;
