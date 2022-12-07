import { NextApiRequest, NextApiResponse } from "next";

import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { getToken } from "next-auth/jwt";

import { prisma } from "../utils/prisma";

async function getUserFromRequest(req: NextApiRequest) {
    const token = await getToken({ req });

    if (!token?.email) return null;

    const user = await prisma.user.findUnique({
        where: {
            email: token.email,
        },
        include: {
            tagPreference: true,
        },
    });

    return user ? user : null;
}

export async function createContext({
    req,
    res,
}: trpcNext.CreateNextContextOptions) {
    const user = await getUserFromRequest(req);

    return { req, res, prisma, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
