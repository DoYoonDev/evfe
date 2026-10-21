import { z } from 'zod';

const fields = {
  id: z.string().nonempty('id는 필수 사항입니다.'),
  koText: z.string().nonempty('한국어 메시지는 필수 사항입니다.'),
  enText: z.string().nonempty('영어 메시지는 필수 사항입니다.'),
  isActive: z.boolean(),
};

const MessageSchema = z.object({
  id: fields.id,
  koText: fields.koText,
  enText: fields.enText,
  isActive: fields.isActive,
});

export const MessageCreateSchema = MessageSchema;

export type MessageCreateSchemaValues = z.infer<typeof MessageCreateSchema>;

export const MessageEditSchema = MessageSchema;

export type MessageEditSchemaValues = z.infer<typeof MessageEditSchema>;
