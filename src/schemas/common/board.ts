import z from "zod";

const baseFields = {
    title: z.string().nonempty('제목은 필수입니다.'),
    content: z.string().nonempty('내용은 필수입니다.'),
    attachFileGroupId: z.union([z.string(), z.number()]).optional(),
    isPin: z.boolean().optional(),
};

export const BoardEditSchema = z.object({
    id: z.number(),
    updateMemberId: z.string().nonempty("작성자는 필수입니다."),
    ...baseFields,
})

export const BoardCreateSchema = z.object({
    createMemberId: z.string().nonempty("작성자는 필수입니다."),
    ...baseFields,
})

export type BoardEditSchemaValues = z.infer<typeof BoardEditSchema>;

export type BoardCreateSchemaValues = z.infer<typeof BoardCreateSchema>