import { CheckIcon, ClockIcon, XIcon } from "@heroicons/react/outline";
import { Badge } from "@mantine/core";
import { ArticleModStates } from "@prisma/client";

const StatusBadge = ({ status }: { status: ArticleModStates }) => {
    if (status === "pending_mod")
        return (
            <Badge leftSection={<ClockIcon className="w-4" />} color="yellow">
                審核中
            </Badge>
        );
    if (status === "passed")
        return (
            <Badge leftSection={<CheckIcon className="w-4" />} color="green">
                審核通過
            </Badge>
        );
    if (status === "failed")
        return (
            <Badge leftSection={<XIcon className="w-4" />} color="red">
                審核未通過
            </Badge>
        );
    if (status === "report_pending_mod")
        return (
            <Badge leftSection={<ClockIcon className="w-4" />} color="yellow">
                因檢舉審核中
            </Badge>
        );
    return <Badge />;
};

export default StatusBadge;
