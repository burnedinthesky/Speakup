import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLinkPreview } from "../../../server/router/advocate/article.router";
import { ReferencesLink } from "../../../types/article.types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestBody = JSON.parse(req.body);
    const url: string = requestBody.link;

    let ret: ReferencesLink;

    try {
        ret = await fetchLinkPreview(url);
    } catch {
        res.status(404).json("Not found");
        return;
    }

    res.status(200).json(ret);
    return;
}
