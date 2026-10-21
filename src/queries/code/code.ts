import { queryOptions } from '@tanstack/react-query';

import {
  getCode,
  getCodeGroup,
  getCodeGroups,
  getCodes,
} from '@/api/admin/code.ts';
import type { CodeGroupSearch, CodeSearch } from '@/types/admin/code.ts';
import { QUERY_KEYS } from '@/constants/query-key.ts';

export const codeQueries = {
  all: () => [QUERY_KEYS.CODES],

  details: (id: string) => [...codeQueries.all(), QUERY_KEYS.DETAIL, id],
  detail: (id: string) =>
    queryOptions({
      queryKey: [...codeQueries.details(id)],
      queryFn: () => getCode(id),
    }),

  lists: (id: string) => [...codeQueries.all(), QUERY_KEYS.LIST, id],
  list: (id: string, filter: CodeSearch) =>
    queryOptions({
      queryKey: [...codeQueries.lists(id), filter],
      queryFn: () => getCodes(id, filter),
      enabled: !!id,
      select: (data: any) => {
        return data.codeInfos;
      },
    }),

  groupDetails: (id: string) => [
    ...codeQueries.all(),
    QUERY_KEYS.GROUP_DETAIL,
    id,
  ],
  groupDetail: (id: string) =>
    queryOptions({
      queryKey: [...codeQueries.groupDetails(id)],
      queryFn: () => getCodeGroup(id),
    }),

  groupLists: () => [...codeQueries.all(), QUERY_KEYS.GROUP_LIST],
  groupList: (filter: CodeGroupSearch) =>
    queryOptions({
      queryKey: [...codeQueries.groupLists(), filter],
      queryFn: () => getCodeGroups(filter),
      select: (data: any) => {
        return data.codeInfos;
      },
    }),
};
