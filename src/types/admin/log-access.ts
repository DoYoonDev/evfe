export interface LogAccess {
  id: string;
  // member?: Member;
  memberId?: string;
  requestUrl: string;
  requestMethod: string;
  requestPayload: string;
  requestIp: string;
  responseStatus: number;
  responseBody: string;
  createdAt: string;
}

export type LogAccessListFilter = {
  memberId?: string;
  accessedAtStart?: string;
  accessedAtEnd?: string;
  page: number;
  size: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  sort?: string;  
};

// export interface LogAccessSearch {
//   memberId?: string;
//   requestUrl?: string;
//   requestMethod?: string;
//   requestIp?: string;
//   page?: number;
// }

// export type AccessLogPage = Page<LogAccess> & LogAccessSearch;
