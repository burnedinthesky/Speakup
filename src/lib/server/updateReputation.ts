import { prisma } from "utils/prisma";

export const updateUserReputation = ({
	userId,
	amount,
}: {
	userId: string;
	amount: number;
}) => {
	if (amount === 0) return new Promise((resolve) => resolve(undefined));

	return prisma.user.update({
		where: { id: userId },
		data: {
			reputation: { increment: amount },
		},
	});
};
