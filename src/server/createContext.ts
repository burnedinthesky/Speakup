import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from '../utils/prisma'

function getUserFromRequest(req: NextApiRequest){
  return req.body.user
}

export function createContext({
    req,
    res,
  }: {
    req: NextApiRequest
    res: NextApiResponse
  }) {  
    const user = getUserFromRequest(req)

    return { req, res, prisma, user }
  }

export type Context = ReturnType<typeof createContext>