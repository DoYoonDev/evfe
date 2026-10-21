import { z } from 'zod';

const fields = {
    id: z.string().nonempty('기존 패스워드를 입력해주세요'),
    currentPw: z.string().nonempty('기존 패스워드를 입력해주세요'),
    newPw: z
        .string()
        .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다"
        )
        .nonempty('새로운 패스워드를 입력해주세요'),
};

const PasswordSchema = z.object({
    id: fields.id,
    currentPw: fields.currentPw,
    newPw: fields.newPw,
});

export const PasswordEditSchema = PasswordSchema;

export type PasswordEditSchemaValue = z.infer<typeof PasswordEditSchema>;