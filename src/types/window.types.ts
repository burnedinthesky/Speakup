export type WidthBreakpoints = "sml" | "sm" | "md" | "lg" | "xl" | "2xl";

export const WidthBreakConversion = (width: number): WidthBreakpoints => {
    if (width >= 1536) return "2xl";
    else if (width >= 1280) return "xl";
    else if (width >= 1024) return "lg";
    else if (width >= 768) return "md";
    else if (width >= 640) return "sm";
    else return "sml";
};
