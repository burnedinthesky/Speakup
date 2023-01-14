import { AvcAllowedRoles } from "types/advocate/user.types";

export const CheckAvcClearance = (role: string | undefined) => {
	if (role && AvcAllowedRoles.includes(role)) return true;
	else return false;
};
