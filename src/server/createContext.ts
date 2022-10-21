import { inferAsyncReturnType } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../utils/prisma";

import { getToken } from "next-auth/jwt";

async function getUserFromRequest(req: NextApiRequest) {
    const token = await getToken({ req });

    if (!token?.email) return null;

    const user = await prisma.user.findUnique({
        where: {
            email: token.email,
        },
    });

    return user ? user : null;
}

export async function createContext({
    req,
    res,
}: {
    req: NextApiRequest;
    res: NextApiResponse;
}) {
    const user = await getUserFromRequest(req);

    return { req, res, prisma, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
