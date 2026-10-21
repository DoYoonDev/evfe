import { z } from 'zod';

const baseFields = {
  koName: z.string().nonempty('이름(한글)은 필수입니다.'),
  enName: z.string().nonempty('이름(영문)은 필수입니다.'),
  email: z.string().email('유효한 이메일 형식이어야 합니다.'),
  phoneNumber: z.string().nonempty('휴대폰 번호는 필수입니다.'), // 휴대폰 번호는 선택 사항으로 처리
  isActive: z.boolean().optional(), // 기본값 사용 시 optional
};

// Create 시 ID는 입력 안 받는다고 가정
export const MemberCreateSchema = z.object({
  ...baseFields,
});

export type MemberCreateSchemaValues = z.infer<typeof MemberCreateSchema>;

// Edit 시 ID는 필수
export const MemberEditSchema = z.object({
  id: z.string().nonempty('ID는 필수입니다.'),
  ...baseFields,
});

export type MemberEditSchemaValues = z.infer<typeof MemberEditSchema>;
