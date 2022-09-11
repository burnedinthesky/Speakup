import { useState, useRef, forwardRef } from "react";
import { Checkbox, TextInput, Button } from "@mantine/core";

interface ReportMenuProps {
    title: string;
    options: { key: string; text: string }[];
    maxReasons: number;
    allowOther: boolean;
    submitFunction: (
        value: string[],
        content?: string
    ) => Promise<"success" | "failed">;
    setMenuSubmittionStatus: (value: "" | "success" | "failed") => void;
}

const ReportMenu = forwardRef<HTMLDivElement, ReportMenuProps>(
    (
        {
            title,
            options,
            maxReasons,
            allowOther,
            submitFunction,
            setMenuSubmittionStatus,
        },
        ref
    ) => {
        const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
        const [otherReason, setOtherReason] = useState<string>("");
        const [radioGroupError, setRadioGroupError] = useState<string>("");
        const [otherInputError, setOtherInputError] = useState<string>("");

        const [submittionStatus, setSubmittionStatus] = useState<
            "" | "loading" | "success" | "failed"
        >("");

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
                            setMenuSubmittionStatus("success");
                        })
                        .catch((err) => {
                            setMenuSubmittionStatus("failed");
                        });
                }
                return;
            } else if (selectedReasons.length == 0) {
                setRadioGroupError("請選擇檢舉原因");
                return;
            }
            setSubmittionStatus("loading");
            submitFunction(selectedReasons)
                .then(() => {
                    setMenuSubmittionStatus("success");
                })
                .catch(() => {
                    setMenuSubmittionStatus("failed");
                });
        };

        return (
            <div ref={ref}>
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
                                }}
                                error={otherInputError}
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
    }
);

ReportMenu.displayName = "ReportMenu";

export default ReportMenu;
