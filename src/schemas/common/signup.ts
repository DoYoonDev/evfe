import { z } from 'zod';

const fields = {
  userId: z
    .string()
    .min(5, '아이디는 5자 이상이어야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 밑줄(_)만 허용됩니다.'),
  password: z
    .string()
    .min(8, '패스워드는 8자 이상이어야 합니다.')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, '영문 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.'),
  confirmedPassword: z.string().nonempty('비밀번호 확인은 필수 사항입니다.'),
  koName: z.string().nonempty('한국어 이름은 필수 사항입니다.'),
  enName: z.string().nonempty('영어 이름은 필수 사항입니다.'),
  email1: z.string().nonempty('이메일은 필수 사항압니다.'),
  email2: z.string().nonempty('이메일은 필수 사항압니다.'),
  phone1: z.string().length(3, '3자리 입력'),
  phone2: z.string().length(4, '4자리 입력'),
  phone3: z.string().length(4, '4자리 입력'),
  isActive: z.boolean(),
  termsAgreed: z.object({
    service: z.boolean(),
    privacy: z.boolean(),
  }),
};

const SugnUpSchema = z.object({
  userId: fields.userId,
  password: fields.password,
  confirmedPassword: fields.confirmedPassword,
  koName: fields.koName,
  enName: fields.enName,
  email1: fields.email1,
  email2: fields.email2,
  phone1: fields.phone1,
  phone2: fields.phone2,
  phone3: fields.phone3,
  isActive: fields.isActive,
  termsAgreed: fields.termsAgreed,
});

export const SignUpCreateSchema = SugnUpSchema;

export type SignUpCreateSchemaValues = z.infer<typeof SignUpCreateSchema>;
