import { CheckIcon, ClockIcon } from "@heroicons/react/outline";
import { Badge } from "@mantine/core";

const StatusBadge = ({ status }: { status: "pending_mod" | "passed" }) => {
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
    return <Badge />;
};

export default StatusBadge;
