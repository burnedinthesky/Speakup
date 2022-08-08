import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { createUserOutputSchema, createUserSchema } from "../../schema/user.schema"
import * as trpc from '@trpc/server'
import { createRouter } from "../createRouter"

export const userRouter = createRouter()
.mutation('register-user', {
    input: createUserSchema, 
    async resolve({ctx, input}) {
        const { email, username, password } = input

        try{
            const user = await ctx.prisma.user.create({
                data:{
                    username,
                    email, 
                    password,
                }, 
            })
    
            return user
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code === 'P2002'){
                    throw new trpc.TRPCError({
                        code: 'CONFLICT', 
                        message: 'User already exists',
                    })
                }
            }
            throw new trpc.TRPCError({
                code: 'INTERNAL_SERVER_ERROR', 
                message: 'Something went wrong'
            })
        }
    }
})