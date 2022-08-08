import z from 'zod'

export const createUserSchema = z.object({
    username: z.string(), 
    email: z.string().email(), 
    password: z.string()
})

export const createUserOutputSchema = z.object({
    username: z.string(), 
    email: z.string().email(), 
    password: z.string()
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>
