import { Progress } from "@mantine/core";
import {
    repLevelGoal,
    repLevelPrevGoal,
    repNumToColor,
} from "../../../lib/reputation";

interface ReputationBarProps {
    reputation: number;
}

const ReputationBar = ({ reputation }: ReputationBarProps) => {
    return (
        <div className="flex flex-nowrap items-center gap-4">
            <div className="w-56">
                <Progress
                    color={repNumToColor(reputation)}
                    value={
                        repLevelGoal(reputation)
                            ? ((reputation - repLevelPrevGoal(reputation)) /
                                  ((repLevelGoal(reputation) as number) -
                                      repLevelPrevGoal(reputation))) *
                              100
                            : 100
                    }
                />
            </div>
            <p
                style={{
                    color: repNumToColor(reputation, "hex"),
                }}
            >
                {reputation}
                {repLevelGoal(reputation) ? "/" : ""}
                {repLevelGoal(reputation)}
            </p>
        </div>
    );
};

export default ReputationBar;
