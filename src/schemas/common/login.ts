import { z } from 'zod';

const fields = {
  userId: z.string().nonempty('id는 필수 사항입니다.'),
  password: z.string().nonempty('비밀번호는 필수 사항입니다.'),
};

const LoginSchema = z.object({
  userId: fields.userId,
  password: fields.password,
});

export const LoginRequestSchema = LoginSchema;

export type LoginRequestSchemaValues = z.infer<typeof LoginSchema>;
