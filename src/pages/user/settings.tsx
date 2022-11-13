import { Button, Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AppShell } from "../../components/AppShell";
import SettingsField from "../../components/Settings/SettingsField";
import UpdatePasswordForm from "../../components/Settings/UpdatePasswordForm";

const Settings = () => {
    const { data: session } = useSession();

    const [modalDisplayComp, setModalDisplayComp] = useState<string | null>(
        null
    );

    return (
        <>
            <AppShell title="Speakup - 設定">
                <div className="lg:ml-64">
                    <div className="mx-auto mt-14 max-w-3xl rounded-md bg-white px-8 py-5 md:mt-28 ">
                        <h1 className="text-2xl text-primary-700">您的設定</h1>
                        <div className="mt-6 flex w-full flex-col gap-6">
                            <SettingsField
                                title="您的使用者名稱"
                                rightSection={<p>{session?.user.name}</p>}
                            />
                            <SettingsField
                                title="您的信箱"
                                desc="您的登入信箱"
                                rightSection={<p>{session?.user.email}</p>}
                            />
                            <SettingsField
                                title="您的密碼"
                                rightSection={
                                    <Button
                                        className="bg-primary-600"
                                        onClick={() => {
                                            setModalDisplayComp(
                                                "resetPassword"
                                            );
                                        }}
                                    >
                                        修改
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            </AppShell>
            <Modal
                opened={typeof modalDisplayComp === "string"}
                onClose={() => {
                    setModalDisplayComp(null);
                }}
                centered
                withCloseButton={false}
            >
                {modalDisplayComp === "resetPassword" && <UpdatePasswordForm />}
            </Modal>
        </>
    );
};

export default Settings;
