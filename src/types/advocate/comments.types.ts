export type ToModComments = {
    id: number;
    type: "argument" | "comment";
    argument?: {
        id: number;
        content: string;
    };
    content: string;
    reportedReasons: {
        reason: string;
        percentage: number;
    }[];
    daysRemaining: number;
};
