import { Modal } from "@mantine/core";
import SignInPage from "./SignInForm";
import { useSignupModalStore } from "@/lib/stores/signupStores";

const SignupModal = () => {
	const [opened, setOpened] = useSignupModalStore((state) => [
		state.open,
		state.setOpen,
	]);

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
