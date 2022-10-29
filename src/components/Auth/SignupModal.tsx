import { Modal } from "@mantine/core";
import { useRouter } from "next/router";

import { useRecoilState } from "recoil";
import { openSignupDialog } from "../../atoms/openSignupDialog";
import SignInPage from "./SignInForm";

const SignupModal = () => {
    const [opened, setOpened] = useRecoilState(openSignupDialog);
    const router = useRouter();

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
                            window.location.href =
                                "/user/signin?forgotPassword=t";
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
