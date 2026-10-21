export interface Member {
  id: string;
  koName: string;
  enName: string;
  email: string;
  phoneNumber?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tosId?: string;
  topId?: string;
}

export type MemberCreateRequest = Omit<Member, 'updateUser' | 'updatedAt'>;

export type MemberListFilter = {
  column?: string;
  keyword?: string;
  page: number;
  size: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  sort?: string;  
};