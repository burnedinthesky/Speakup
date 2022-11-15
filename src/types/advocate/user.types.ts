export const AvcAllowedRoles = ["ADVOCATE", "SENIOR_ADVOCATE", "ADMIN"];

export const CheckAvcClearance = (role: string | undefined) => {
    if (role && AvcAllowedRoles.includes(role)) return true;
    else return false;
};
