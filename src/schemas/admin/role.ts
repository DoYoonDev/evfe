import { z } from 'zod';

const fields = {
  id: z.string().nonempty('ID는 필수 사항입니다.'),
  name: z.string().nonempty('이름은 필수 사항입니다.'),
  description: z.string().nullable(),
  isActive: z.boolean(),
  level: z.coerce.number().int().min(0, '레벨은 0 이상의 숫자여야 합니다.'),
};

export const RoleSchema = z.object(fields);
export type RoleSchemaValues = z.infer<typeof RoleSchema>;

export const RoleUpdateSchema = RoleSchema.pick({
  id: true,
  name: true,
  description: true,
  isActive: true,
  level: true,
});
export type RoleUpdateSchemaValues = z.infer<typeof RoleUpdateSchema>;
