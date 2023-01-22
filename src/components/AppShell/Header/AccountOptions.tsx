import { useRouter } from "next/router";

import { Avatar, Menu, PopoverBaseProps } from "@mantine/core";
import {
	CogIcon,
	ChevronDownIcon,
	LogoutIcon,
	MicrophoneIcon,
	UserCircleIcon,
} from "@heroicons/react/outline";

import { signOut, useSession } from "next-auth/react";
import { CheckAvcClearance } from "lib/advocate/auth";

interface AccountOptionProps {
	menuPosition?: PopoverBaseProps["position"];
}

const AccountOptions = ({ menuPosition }: AccountOptionProps) => {
	const router = useRouter();
	const { data: session } = useSession();

	return (
		<Menu position={menuPosition ?? "bottom-end"}>
			<Menu.Target>
				<button>
					<Avatar
						src={session?.user.profileImg}
						radius="xl"
						size={30}
						color="cyan"
					>
						{session?.user.name[0]}
					</Avatar>
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
