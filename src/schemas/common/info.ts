import { z } from 'zod';

const fields = {
    id: z.string(),
    koName: z.string().nonempty('한국어 이름은 필수 사항입니다.'),
    enName: z.string().nonempty('영어 이름은 필수 사항입니다.'),
    email: z.string().nonempty('이메일은 필수 사항입니다.'),
    phoneNumber: z.string().nonempty('휴대폰 번호는 필수 사항입니다.'),
};

const InfoSchema = z.object({
    id: fields.id,
    koName: fields.koName,
    enName: fields.enName,
    email: fields.email,
    phoneNumber: fields.phoneNumber,
});

export const InfoEditSchema = InfoSchema;

export type InfoEditSchemaValues = z.infer<typeof InfoEditSchema>;