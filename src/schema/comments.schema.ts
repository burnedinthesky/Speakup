import z from 'zod';

export const createCommentsSchema = z.object({
    content: z.string(), 
    articleId: z.string(),
    onside: z.string().max(3)
})

export type createCommentsInput = z.TypeOf<typeof createCommentsSchema>

export const getComments = z.object({
    articleId: z.string().uuid(),
    onside: z.string()
})