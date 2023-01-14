import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const auth = req.headers.authorization;

	if (auth !== `Bearer ${process.env.ADMIN_API_KEY as string}`) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	await prisma.articleViews.deleteMany();

	res.status(200).json({ success: true });
}
