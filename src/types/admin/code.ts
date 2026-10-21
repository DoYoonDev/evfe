import type { Page } from '@/types/common/page.ts';

export interface Code {
  id: string;
  codeGroup: CodeGroup;
  messageId: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CodeGroup {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CodeSearch {
  id?: string;
  groupId?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  page?: number;
}

export interface CodeGroupSearch {
  id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  page?: number;
}

export type CodePage = CodeSearch & Page<Code>;

export type CodeGroupPage = CodeGroupSearch & Page<CodeGroup>;

export interface CodeCreateRequest
  extends Omit<Code, 'codeGroup' | 'createUser' | 'createdAt'> {
  groupId: string;
}

export interface CodeUpdateRequest
  extends Omit<Code, 'codeGroup' | 'updateUser' | 'updatedAt'> {
  id: string;
  groupId: string;
}

export type CodeGroupCreateRequest = Omit<
  CodeGroup,
  'createUser' | 'createdAt'
>;

export interface CodeGroupUpdateRequest
  extends Omit<CodeGroup, 'updateMember' | 'updatedAt'> {
  id: string;
}
