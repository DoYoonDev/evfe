import { QUERY_KEYS } from '@/constants/query-key.ts';
import { queryOptions } from '@tanstack/react-query';
import { getAuthInfo } from '@/api/auth.ts';

export const authQueries = {
  all: () => [QUERY_KEYS.AUTH],

  authInfos: () => [...authQueries.all(), QUERY_KEYS.DETAIL],
  authInfo: () =>
    queryOptions({
      queryKey: [...authQueries.authInfos()],
      queryFn: () => getAuthInfo(),
    }),

}