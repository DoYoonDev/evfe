import { queryOptions } from '@tanstack/react-query';
import { getMenus } from '@/api/admin/menu.ts';
import type { MenuGetRequest } from '@/types/common/menu.ts';
import { QUERY_KEYS } from '@/constants/query-key.ts';

export const menuQueries = {
  all: () => [QUERY_KEYS.MENUS],

  listKey: (request: MenuGetRequest = {}) => [...menuQueries.all(), QUERY_KEYS.LIST, request],
  list: (request: MenuGetRequest = {}) =>
    queryOptions({
      queryKey: menuQueries.listKey(request),
      queryFn: () => getMenus(request),
      refetchOnWindowFocus: false,
      retry: 1
    }),
};
