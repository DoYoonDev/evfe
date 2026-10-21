export interface LogLogin {
    id: string;
    memberId?: string;
    accessIp: string;
    success?: boolean;
    createdAt: string;
}

export type LogLoginListFilter = {
  memberId?: string;
  accessedAtStart?: string;
  accessedAtEnd?: string;
  page: number;
  size: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  sort?: string;  
};
