import React, { forwardRef } from "react";
import { Checkbox, TextInput } from "@mantine/core";

interface CustomReasonInputProps {
    enabled: boolean;
    error: string;
    setSelectedReasons: (fn: (value: string[]) => string[]) => void;
}

const CustomReasonInput = forwardRef<HTMLInputElement, CustomReasonInputProps>(
    ({ enabled, error, setSelectedReasons }, ref) => {
        return (
            <div className="flex w-full gap-2">
                <Checkbox
                    value="other"
                    classNames={{ input: "bg-neutral-50" }}
                    disabled={!enabled}
                />
                <TextInput
                    classNames={{
                        root: "flex-grow",
                        input: "border-0 border-b-[1px] bg-neutral-50",
                    }}
                    placeholder="其他"
                    error={error}
                    disabled={!enabled}
                    onFocus={() => {
                        setSelectedReasons((prev) =>
                            prev.includes("other") ? prev : prev.concat("other")
                        );
                    }}
                    ref={ref}
                />
            </div>
        );
    }
);

CustomReasonInput.displayName = "CustomReasonInput";

export default CustomReasonInput;
