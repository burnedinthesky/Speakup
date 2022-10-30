import { useState, useRef, useEffect } from "react";
import { Checkbox, Button } from "@mantine/core";
import CustomReasonInput from "./CustomReasonInput";
import { ConfigParams, ReportConfigs } from "./reportConfigs";

interface ReportMenuProps {
    type: "article" | "argument" | "comment";
    submitFunction: (reasons: string[]) => void;
    submissionLoading: boolean;
    setDivHeight: (value: number) => void;
}

const ReportMenu = ({
    type,
    submissionLoading,
    submitFunction,
    setDivHeight,
}: ReportMenuProps) => {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [radioGroupError, setRadioGroupError] = useState<string>("");
    const [otherInputError, setOtherInputError] = useState<string>("");

    const rootRef = useRef<HTMLDivElement>(null);
    const otherInputRef = useRef<HTMLInputElement>(null);

    const { title, options, maxReasons, allowOther } = ReportConfigs[
        type
    ] as ConfigParams;

    useEffect(() => {
        if (rootRef.current) setDivHeight(rootRef.current?.clientHeight);
    });

    const submitResponse = async () => {
        setRadioGroupError("");
        setOtherInputError("");

        if (selectedReasons.includes("other")) {
            if (!otherInputRef.current)
                throw new Error("Reason Input Ref Not Found");
            const otherReason = otherInputRef.current.innerText;
            if (!otherReason.length) {
                setOtherInputError("請輸入理由");
                return;
            } else if (otherReason.length > 200) {
                setOtherInputError("請在200字內描述");
                return;
            }
            submitFunction(selectedReasons.concat([otherReason]));
            return;
        } else if (selectedReasons.length == 0) {
            setRadioGroupError("請選擇檢舉原因");
            return;
        }

        submitFunction(selectedReasons);
    };

    return (
        <div ref={rootRef}>
            <h3 className="mb-3 text-xl text-neutral-800">{title}</h3>
            {radioGroupError.length > 0 && (
                <p className="mb-3 text-base text-red-500">{radioGroupError}</p>
            )}
            <Checkbox.Group
                value={selectedReasons}
                onChange={(value: string[]) => {
                    if (
                        !value.includes("other") &&
                        otherInputRef.current?.innerText
                    ) {
                        otherInputRef.current.innerText = "";
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
                    <CustomReasonInput
                        enabled={
                            selectedReasons.length < maxReasons ||
                            selectedReasons.includes("other")
                        }
                        error={otherInputError}
                        setSelectedReasons={setSelectedReasons}
                        ref={otherInputRef}
                    />
                )}
            </Checkbox.Group>
            <div className="mt-4 flex w-full justify-end">
                <Button
                    className="ml-auto bg-primary-700 enabled:hover:bg-primary-800"
                    loading={submissionLoading}
                    disabled={selectedReasons.length == 0}
                    onClick={submitResponse}
                >
                    提交此檢舉
                </Button>
            </div>
        </div>
    );
};

export default ReportMenu;
