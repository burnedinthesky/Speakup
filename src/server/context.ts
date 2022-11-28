import type { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// export type Context = {
//     req: NextApiRequest,
//     res: NextApiResponse,
//     prisma: PrismaClient,
//     user: User | null
// }

// -------------------------------------------------
// @filename: context.ts
// -------------------------------------------------
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

import { getToken } from "next-auth/jwt";

import { prisma } from "../utils/prisma";

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
}: trpcNext.CreateNextContextOptions) {
    const user = await getUserFromRequest(req);

    return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
