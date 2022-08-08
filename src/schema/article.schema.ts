import z from 'zod'

export const createArticleSchema = z.object({
    h1: z.string(), 
    h2: z.string(),
    h3: z.string(), 
    spoiler: z.string(),
    content: z.string(), 
    tags: z.string(), 
})

export type createArticleInput = z.TypeOf<typeof createArticleSchema>

export const getSingleArticleSchema = z.object({
    articleId: z.string().uuid()
})