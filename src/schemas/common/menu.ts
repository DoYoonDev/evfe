import { z } from 'zod';

const fields = {
  name: z.string().nonempty('이름은 필수 사항입니다.'),
  parentMenuId: z.number().nullable(),
  messageId: z.string().nonempty('메시지ID는 필수 사항입니다.'),
  url: z.string().nonempty('URL은 필수 사항입니다.'),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  level: z.number(),
};

export const MenuSchema = z.object(fields);
export type MenuSchemaValues = z.infer<typeof MenuSchema>;

export const MenuUpdateSchema = MenuSchema.pick({
  name: true,
  parentMenuId: true,
  messageId: true,
  url: true,
  description: true,
  isActive: true,
});
export type MenuUpdateSchemaValues = z.infer<typeof MenuUpdateSchema>;
