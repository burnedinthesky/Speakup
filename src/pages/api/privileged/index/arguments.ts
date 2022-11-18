import type { NextApiRequest, NextApiResponse } from "next";
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

    const articleIDs = await prisma.articles.findMany({
        where: {
            requiresArgIndex: true,
        },
        select: {
            id: true,
        },
    });

    for (let i = 0; i < articleIDs.length; i++) {
        let args = await prisma.argument.findMany({
            where: {
                articleId: articleIDs[i]?.id as string,
            },
            select: {
                id: true,
                createdTime: true,
                _count: {
                    select: {
                        likedUsers: true,
                        supportedUsers: true,
                        dislikedUsers: true,
                        argumentReports: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        let sortedArgs = args
            .map((argument, i) => {
                let score = Math.round(
                    argument._count.comments * 15 +
                        argument._count.supportedUsers * 7.5 +
                        argument._count.likedUsers * 5 -
                        argument._count.dislikedUsers * 5 -
                        i ** 1.3 -
                        argument._count.argumentReports * 7.5
                );
                return {
                    id: argument.id,
                    score,
                };
            })
            .sort((a, b) => a.score - b.score);

        await prisma.$transaction(
            sortedArgs
                .map((arg, i) =>
                    prisma.argument.update({
                        where: {
                            id: arg.id,
                        },
                        data: {
                            pagnationSequence: i + sortedArgs.length + 100,
                        },
                    })
                )
                .concat(
                    sortedArgs.map((arg, i) =>
                        prisma.argument.update({
                            where: {
                                id: arg.id,
                            },
                            data: {
                                pagnationSequence: i + 1,
                            },
                        })
                    )
                )
        );
        await prisma.articles.update({
            where: {
                id: articleIDs[i]?.id as string,
            },
            data: {
                requiresArgIndex: false,
            },
        });
    }

    res.status(200).json({ success: true });
}
