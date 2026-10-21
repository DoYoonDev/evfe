import { getAccessLogsPage, getLoginLogsPage } from '@/api/admin/log.ts';
import { LogAccess, LogAccessListFilter } from '@/types/admin/log-access.ts';
import { queryOptions } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/query-key.ts';
import { LogLogin, LogLoginListFilter } from '@/types/admin/log-login';
import { Page } from '@/types/common/page';

// export const logAccessQueries = {
//   all: () => [QUERY_KEYS.LOG_ACCESSS],

//   lists: () => [...logAccessQueries.all(), QUERY_KEYS.LIST],
  // list: (filter: LogAccessSearch) =>
//     queryOptions({
//       queryKey: [...logAccessQueries.lists(), filter],
//       queryFn: () => getAccessLogs(filter),
//       select: (data: any) => {
//         return data.logAccessInfos;
//       },
//     }),
// };
export const logAccessQueries = {
  all: () => [QUERY_KEYS.LOG_ACCESSS],
  listKey: () => [...logAccessQueries.all(), QUERY_KEYS.LIST],
  listPageKey: (filter: LogAccessListFilter) => {
    const _memberId = filter.memberId?.trim() || null;
    const _accessedAtStart = filter.accessedAtStart?.trim() || null;
    const _accessedAtEnd = filter.accessedAtEnd?.trim() || null;
    const _sortField = filter.sortField?.trim() || null;
    const _sortDirection = _sortField ? filter.sortDirection ?? 'asc' : null;

  return [
      ...logAccessQueries.all(),
      QUERY_KEYS.LIST_PAGE,
      _memberId,
      _accessedAtStart,
      _accessedAtEnd,
      _sortField,
      _sortDirection,
      filter.page,
      filter.size,
      filter.sort ?? null,
    ] as const;
  },

  listPage: (filter: LogAccessListFilter) =>
    queryOptions<{
      logAccessInfos: Page<LogAccess>;
    }>({
      queryKey: logAccessQueries.listPageKey(filter),
      queryFn: () =>
        getAccessLogsPage(filter),
    }),
};

const ROOT_KEY = [QUERY_KEYS.LOG_LOGINS];

export const logLoginQueries = {
  // 공통
  all: () => ROOT_KEY,
  listKey: () => [...ROOT_KEY, QUERY_KEYS.LIST],
  listPageKey: (filter: LogLoginListFilter) => {
    const _memberId = filter.memberId?.trim() || null;
    const _accessedAtStart = filter.accessedAtStart?.trim() || null;
    const _accessedAtEnd = filter.accessedAtEnd?.trim() || null;
    const _sortField = filter.sortField?.trim() || null;
    const _sortDirection = _sortField ? filter.sortDirection ?? 'asc' : null;

    return [
      ...ROOT_KEY,
      QUERY_KEYS.LIST_PAGE,
      _memberId,
      _accessedAtStart,
      _accessedAtEnd,
      filter.page,
      filter.size,
      _sortField,
      _sortDirection,
      filter.sort ?? null,
    ] as const;
  },

  listPage: (filter: LogLoginListFilter) =>
    queryOptions<{
      logLoginInfos: Page<LogLogin>;
      // totalElements: number;
      // totalPages: number;
    }>({
      queryKey: logLoginQueries.listPageKey(filter),
      queryFn: () =>
        getLoginLogsPage(filter),
    }),
};
