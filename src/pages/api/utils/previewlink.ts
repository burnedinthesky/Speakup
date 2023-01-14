import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLinksPreview } from "server/router/advocate/article.router";
import { ReferencesLink } from "types/article.types";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const parsedBody = JSON.parse(req.body);
	const url: string | undefined = parsedBody.link;

	if (!url) {
		res.status(400).json("Bad request");
		return;
	}

	let ret: ReferencesLink;

	try {
		ret = (await fetchLinksPreview([url]))[0] as ReferencesLink;
	} catch (e) {
		res.status(404).json("Not found");
		return;
	}

	res.status(200).json(ret);
	return;
}
