import { useRef, useState } from "react";
import { Button, Modal, Checkbox, TextInput } from "@mantine/core";

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
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [otherReason, setOtherReason] = useState<string>("");

    const [radioGroupError, setRadioGroupError] = useState<string>("");
    const [otherInputError, setOtherInputError] = useState<string>("");

    const [submittionStatus, setSubmittionStatus] = useState<
        "" | "loading" | "success" | "failed"
    >("");

    const ReportMenuRef = useRef<HTMLDivElement>(null);
    const ReportResultRef = useRef<HTMLDivElement>(null);
    const OtherReasonRef = useRef<HTMLInputElement>(null);

    const submitResponse = async () => {
        setRadioGroupError("");
        setOtherInputError("");

        if (selectedReasons.includes("other")) {
            if (otherReason == "") {
                setOtherInputError("請輸入理由");
            } else if (otherReason.length > 200) {
                setOtherInputError("請在200字內描述");
            } else {
                setSubmittionStatus("loading");
                submitFunction(selectedReasons, otherReason)
                    .then((res) => {
                        setSubmittionStatus("success");
                    })
                    .catch((err) => {
                        setSubmittionStatus("failed");
                    });
            }
            return;
        } else if (selectedReasons.length == 0) {
            setRadioGroupError("請選擇檢舉原因");
            return;
        }
        setSubmittionStatus("loading");
        submitFunction(selectedReasons)
            .then((res) => {
                setSubmittionStatus("success");
            })
            .catch((err) => {
                setSubmittionStatus("failed");
            });
    };

    const ReportMenu = () => {
        return (
            <div ref={ReportMenuRef}>
                <h3 className="mb-3 text-xl text-neutral-800">{title}</h3>
                {radioGroupError.length > 0 && (
                    <p className="mb-3 text-base text-red-500">
                        {radioGroupError}
                    </p>
                )}
                <Checkbox.Group
                    value={selectedReasons}
                    onChange={(value: string[]) => {
                        if (!value.includes("other") && otherReason !== "") {
                            setOtherReason("");
                        }

                        setSelectedReasons(value);
                    }}
                    size="md"
                    orientation="vertical"
                >
                    {options.map((data, i) => (
                        <Checkbox
                            key={i}
                            value={data.key}
                            label={data.text}
                            classNames={{
                                label: "text-neutral-700",
                                input: "bg-neutral-50",
                            }}
                            className="text-neutral-700"
                            disabled={
                                selectedReasons.includes(data.key)
                                    ? false
                                    : selectedReasons.length >= maxReasons
                            }
                        />
                    ))}
                    {allowOther && (
                        <div className="flex w-full gap-2">
                            <Checkbox
                                value="other"
                                classNames={{ input: "bg-neutral-50" }}
                                disabled={
                                    selectedReasons.includes("other")
                                        ? false
                                        : selectedReasons.length >= maxReasons
                                }
                            />
                            <TextInput
                                classNames={{
                                    root: "flex-grow",
                                    input: "border-0 border-b-[1px] bg-neutral-50",
                                }}
                                placeholder="其他"
                                value={otherReason}
                                onChange={(e) => {
                                    setOtherReason(e.currentTarget.value);
                                    setTimeout(() => {
                                        OtherReasonRef.current?.focus();
                                    }, 10);
                                }}
                                error={otherInputError}
                                ref={OtherReasonRef}
                                disabled={
                                    selectedReasons.includes("other")
                                        ? false
                                        : selectedReasons.length >= maxReasons
                                }
                                onFocus={() => {
                                    if (!selectedReasons.includes("other"))
                                        setSelectedReasons(
                                            ["other"].concat(selectedReasons)
                                        );
                                }}
                            />
                        </div>
                    )}
                </Checkbox.Group>
                <div className="mt-4 flex w-full justify-end">
                    <Button
                        className="ml-auto bg-primary-700 enabled:hover:bg-primary-800"
                        loading={submittionStatus === "loading"}
                        disabled={selectedReasons.length == 0}
                        onClick={submitResponse}
                    >
                        提交此檢舉
                    </Button>
                </div>
            </div>
        );
    };

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
                        <ReportMenu />
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
