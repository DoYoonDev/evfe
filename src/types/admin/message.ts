import type { User } from '@/types/user.ts';
import type { Page } from '@/types/common/page.ts';

export interface Message {
  id: string;
  koText: string;
  enText: string;
  isActive: boolean;
  updateUser: User;
  updatedAt: string;
}

export interface MessageSearch {
  id?: string;
  koText?: string;
  enText?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
}

export type MessagePage = MessageSearch & Page<Message>;

export type MessageCreateRequest = Omit<Message, 'updateUser' | 'updatedAt'>;

export interface MessageUpdateRequest
  extends Omit<Message, 'updateUser' | 'updatedAt'> {
  originalId: string;
}
