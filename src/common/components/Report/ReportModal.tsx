import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "@mantine/core";

import ReportMenu from "./ReportMenu";

interface ReportModalProps {
    open: boolean;
    closeFunction: () => void;
    title: string;
    options: {
        key: string;
        text: string;
    }[];
    allowOther: boolean;
    maxReasons: number;
    submitFunction: (
        value: string[],
        content?: string
    ) => Promise<"success" | "failed">;
}

function ReportModal({
    open,
    closeFunction,
    title,
    options,
    allowOther,
    maxReasons,
    submitFunction,
}: ReportModalProps) {
    const [submittionStatus, setSubmittionStatus] = useState<
        "" | "success" | "failed"
    >("");

    const ReportMenuRef = useRef<HTMLDivElement>(null);
    const ReportResultRef = useRef<HTMLDivElement>(null);

    const ReportResult = () => {
        return (
            <div ref={ReportResultRef}>
                <h3 className="mb-3 text-xl text-neutral-800">
                    {submittionStatus == "success"
                        ? "我們已經收到您的檢舉"
                        : "發生錯誤，請再次一次"}
                </h3>
                <div className="mt-4 flex w-full justify-end">
                    <Button
                        className="ml-auto bg-primary-700 hover:bg-primary-800"
                        onClick={closeFunction}
                    >
                        關閉檢舉介面
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            <Modal
                opened={open}
                onClose={closeFunction}
                withCloseButton={false}
                centered
                size="sm"
                classNames={{ modal: "bg-neutral-50" }}
            >
                <div
                    className="relative w-full overflow-y-auto overflow-x-hidden transition-height duration-300 "
                    style={{
                        height:
                            submittionStatus == "success" ||
                            submittionStatus == "failed"
                                ? ReportResultRef.current?.offsetHeight
                                : ReportMenuRef.current?.offsetHeight,
                    }}
                >
                    <div
                        className={`w-full ${
                            submittionStatus == "success" ||
                            submittionStatus == "failed"
                                ? "-translate-x-full"
                                : ""
                        } transition-transform duration-300 `}
                    >
                        <ReportMenu
                            ref={ReportMenuRef}
                            title={title}
                            options={options}
                            maxReasons={maxReasons}
                            allowOther={allowOther}
                            submitFunction={submitFunction}
                            setMenuSubmittionStatus={setSubmittionStatus}
                        />
                    </div>

                    <div
                        className={`absolute top-0 w-full ${
                            submittionStatus == "success" ||
                            submittionStatus == "failed"
                                ? "translate-x-0"
                                : "translate-x-full"
                        } transition-transform duration-300 `}
                    >
                        <ReportResult />
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ReportModal;
