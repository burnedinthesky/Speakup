import z from 'zod'

export const createReplySchema = z.object({
    content: z.string(),
    motherCommentId: z.number()
})

export type createReplyInput = z.TypeOf<typeof createReplySchema>

export const getReplies = z.object({
    articleId: z.string().uuid(),
    motherCommentId: z.number(),
})