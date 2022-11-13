import type { NextApiRequest, NextApiResponse } from "next";
import { ArticleBlock } from "../../../../types/article.types";
import { articleIndexMod } from "../../../../utils/algolia";
import { prisma } from "../../../../utils/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const auth = req.headers.authorization;

    if (auth !== `Bearer ${process.env.ADMIN_API_KEY as string}`) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const articles = await prisma.articles.findMany({
        select: {
            id: true,
            title: true,
            tags: true,
            author: {
                select: {
                    name: true,
                },
            },
            content: true,
            _count: {
                select: {
                    arguments: true,
                    collections: true,
                },
            },
            createdTime: true,
        },
    });

    articleIndexMod
        .saveObjects(
            articles.map((ele) => {
                const rawContent = ele.content as ArticleBlock[];
                return {
                    objectID: ele.id,
                    title: ele.title,
                    tags: [...ele.tags, "one"],
                    author: ele.author.name,
                    content: rawContent.map((ele) => ele.content).join("\n"),
                    createdDate: ele.createdTime,
                    interaction:
                        ele._count.arguments * 3 + ele._count.collections,
                };
            })
        )
        .then((response) => {
            res.status(200).json(response);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
}
