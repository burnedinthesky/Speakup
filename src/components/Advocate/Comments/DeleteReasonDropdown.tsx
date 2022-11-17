import { Button, Checkbox } from "@mantine/core";
import React from "react";
import { ReportConfigs } from "../../../common/components/Report/ReportMenu/reportConfigs";
import ReportedReason from "./ReportedReason";

interface DeleteReasonDropdownProps {
    type: "argument" | "comment";
    violatedRules: string[];
    setViolatedRules: (fn: (cur: string[]) => string[]) => void;
    deleteComment: () => void;
    cancelDelete?: () => void;
}

const DeleteReasonDropdown = ({
    type,
    violatedRules,
    setViolatedRules,
    deleteComment,
    cancelDelete,
}: DeleteReasonDropdownProps) => {
    return (
        <>
            <div>
                <h3 className="text-sm font-bold">移除原因</h3>
                <div className="mt-3 flex flex-col gap-1">
                    {ReportConfigs[type]?.options.map((option, i) => (
                        <Checkbox
                            key={i}
                            size="sm"
                            value={option.key}
                            label={option.text}
                            checked={violatedRules.includes(option.text)}
                            onChange={(e) => {
                                if (e.currentTarget.checked)
                                    setViolatedRules((cur) => [
                                        ...cur,
                                        option.text,
                                    ]);
                                else
                                    setViolatedRules((cur) =>
                                        cur.filter(
                                            (rule) => rule !== option.text
                                        )
                                    );
                            }}
                        />
                    ))}
                </div>
            </div>
            <div>
                <div className="flex w-full justify-end gap-2">
                    <Button
                        size="xs"
                        radius="xl"
                        color="gray"
                        variant="light"
                        onClick={cancelDelete ? cancelDelete : close}
                    >
                        取消
                    </Button>
                    <Button
                        size="xs"
                        radius="xl"
                        className="bg-primary-600"
                        onClick={() => {
                            deleteComment();
                        }}
                    >
                        移除
                    </Button>
                </div>
                <hr className="my-2 w-full border-b border-b-slate-300 px-3" />
                <ReportedReason />
            </div>
        </>
    );
};

export default DeleteReasonDropdown;
