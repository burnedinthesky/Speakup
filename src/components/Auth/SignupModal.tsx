import { useRecoilState } from "recoil";

import { Modal } from "@mantine/core";
import SignInPage from "./SignInForm";

import { openSignupDialog } from "lib/atoms/openSignupDialog";

const SignupModal = () => {
	const [opened, setOpened] = useRecoilState(openSignupDialog);

	return (
		<Modal
			opened={opened}
			onClose={() => {
				setOpened(false);
			}}
			withCloseButton={false}
			centered
			transition="skew-up"
		>
			<div className="w-full px-8 py-6">
				<SignInPage
					setDisplayPage={(page) => {
						if (page == "reqResetPwd") {
							window.location.href = "/user/signin?forgotPassword=t";
						}
					}}
					setDivHeight={() => {}}
					signInSuccessCallback={() => {
						setOpened(false);
					}}
				/>
			</div>
		</Modal>
	);
};

export default SignupModal;
