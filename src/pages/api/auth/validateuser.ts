import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { sendgrid } from "utils/sendgrid";

const createNewCredVal = async (userID: string, userEmail: string) => {
	const token = Math.floor(100000 + Math.random() * 900000).toString();

	let expireDate = new Date();
	expireDate.setDate(expireDate.getDate() + 1);

	const emailToken = await prisma.credEmailVerToken.create({
		data: {
			user: {
				connect: {
					id: userID,
				},
			},
			expiers: expireDate,
			valToken: token,
		},
	});

	const msg = {
		to: userEmail,
		from: "noreply@speakup.place",
		subject: "Speakup 驗證碼",
		html: `您的Speakup驗證碼為 <strong>${emailToken.valToken}</strong>`,
	};

	await sendgrid.send(msg);

	return emailToken.id;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		res.status(400).json({ Error: "Method not allowed" });
		return;
	}

	const body = JSON.parse(req.body);
	const id = body.id;

	if (!id) {
		res.status(400).json({ Error: "ID not provided" });
		return;
	}

	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
		include: {
			credEmailVerToken: {
				select: {
					id: true,
					expiers: true,
				},
			},
		},
	});

	if (!user) {
		res.status(401).json({ Error: "Invalid ID" });
		return;
	}

	if (!user.emailVerified) {
		let tokenId: string = "";
		if (!user.credEmailVerToken?.id) {
			tokenId = await createNewCredVal(user.id, user.email);
		} else {
			if (user.credEmailVerToken.expiers < new Date()) {
				await prisma.credEmailVerToken.delete({
					where: {
						id: user.credEmailVerToken.id,
					},
				});
				tokenId = await createNewCredVal(user.id, user.email);
			} else tokenId = user.credEmailVerToken.id;
		}

		return res.status(201).json({ Token: tokenId });
	}

	if (!user.onBoarded) {
		return res.status(200).json({ Message: "Onboard" });
	}

	res.status(200).json({ Message: "Valid" });
}
