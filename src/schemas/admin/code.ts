import { z } from 'zod';

const fields = {
  id: z.string().nonempty('id는 필수 사항입니다.'),
  groupId: z.string().nonempty('코드그룹 ID는 필수 사항입니다.'),
  messageId: z.string().nonempty('메시지 ID는 필수 사항입니다.'),
  name: z.string().nonempty('코드명은 필수 사항입니다.'),
  description: z.string(),
  sortOrder: z.coerce.number().int().min(0, '정렬순서는 0 이상의 정수여야 합니다.').default(0),
  isActive: z.boolean(),
};

const CodeSchema = z.object({
  id: fields.id,
  groupId: fields.groupId,
  messageId: fields.messageId,
  name: fields.name,
  description: fields.description,
  sortOrder: fields.sortOrder,
  isActive: fields.isActive,
});

const groupFields = {
  id: z.string().nonempty('id는 필수 사항입니다.'),
  name: z.string().nonempty('코드명은 필수 사항입니다.'),
  description: z.string(),
  isActive: z.boolean(),
};

const CodeGroupSchema = z.object({
  id: groupFields.id,
  name: groupFields.name,
  description: groupFields.description,
  isActive: groupFields.isActive,
});

export const CodeCreateSchema = CodeSchema;

export type CodeCreateSchemaValues = z.infer<typeof CodeCreateSchema>;

export const CodeEditSchema = CodeSchema;

export type CodeEditSchemaValues = z.infer<typeof CodeEditSchema>;

export const CodeGroupCreateSchema = CodeGroupSchema;

export type CodeGroupCreateSchemaValues = z.infer<typeof CodeGroupCreateSchema>;

export const CodeGroupEditSchema = CodeGroupSchema;

export type CodeGroupEditSchemaValues = z.infer<typeof CodeGroupEditSchema>;
