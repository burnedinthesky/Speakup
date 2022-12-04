//prettier-ignore
export const repMantineColors = ["gray", "red", "orange", "yellow", "green", "blue", "violet"]
//prettier-ignore
export const repHexColors = ['#6b7280', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
//prettier-ignore
export const repDarkHexColors = ['#1f2937', '#991b1b', '#ea580c', '#ca8a04', '#16a34a', '#1d4ed8', '#6d28d9']

export const repNumToColor = (
    value: number,
    varient: "mantine" | "hex" | "hexDark" = "mantine"
): string => {
    const retArr =
        varient === "mantine"
            ? repMantineColors
            : varient === "hex"
            ? repHexColors
            : repDarkHexColors;

    if (value >= 6000) return retArr[6] as string;
    else if (value >= 4000) return retArr[5] as string;
    else if (value >= 2500) return retArr[4] as string;
    else if (value >= 1500) return retArr[3] as string;
    else if (value >= 1000) return retArr[2] as string;
    else if (value >= 500) return retArr[1] as string;
    return retArr[0] as string;
};

export const repLevelGoal = (value: number): number | null => {
    if (value >= 6000) return null;
    else if (value >= 4000) return 6000;
    else if (value >= 2500) return 4000;
    else if (value >= 1500) return 2500;
    else if (value >= 1000) return 1500;
    else if (value >= 500) return 1000;
    return 500;
};

export const repLevelPrevGoal = (value: number): number => {
    if (value >= 6000) return 6000;
    else if (value >= 4000) return 4000;
    else if (value >= 2500) return 2500;
    else if (value >= 1500) return 1500;
    else if (value >= 1000) return 1000;
    else if (value >= 500) return 500;
    return 0;
};
