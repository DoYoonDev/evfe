import { queryOptions } from '@tanstack/react-query';
import {
  getMembers,
  getMemberDetail,
  getMembersPage,
} from '@/api/admin/member';
import { QUERY_KEYS } from '@/constants/query-key';
import { Member, MemberListFilter } from '@/types/admin/member';
import { Page } from '@/types/common/page';

const ROOT_KEY = [QUERY_KEYS.MEMBERS];

export const memberQueries = {
  // 공통
  all: () => ROOT_KEY,
  listKey: () => [...ROOT_KEY, QUERY_KEYS.LIST],
  listPageKey: (filter: MemberListFilter) => {
    const _column = filter.column?.trim() || null;
    const _keyword = filter.keyword?.trim() || null;
    const _sortField = filter.sortField?.trim() || null;
    const _sortDirection = _sortField ? filter.sortDirection ?? 'asc' : null;

    return [
      ...ROOT_KEY,
      QUERY_KEYS.LIST_PAGE,
      _column,
      _keyword,
      filter.page,
      filter.size,
      _sortField,
      _sortDirection,
      filter.sort ?? null,
    ] as const;
  },
  
  detailKey: (id: string) => [...ROOT_KEY, QUERY_KEYS.DETAIL, id],
  // 상세 조회
  detail: (id: string) =>
    queryOptions<Member>({
      queryKey: memberQueries.detailKey(id),
      queryFn: () => getMemberDetail(id),
    }),

  // 목록 조회
  list: () =>
    queryOptions<Member[]>({
      queryKey: memberQueries.listKey(),
      queryFn: async () => {
        const res = await getMembers();
        return res.memberInfos;
      },
    }),

  listPage: (filter: MemberListFilter) =>
    queryOptions<{
      memberInfos: Page<Member>;
    }>({
      queryKey: memberQueries.listPageKey(filter),
      queryFn: () =>
        getMembersPage(filter),
    }),

  searchKey: (params: { q: string; page: number; size: number }) =>
    memberQueries.listPageKey({
      column: 'id',
      keyword: params.q,
      page: params.page,
      size: params.size,
    }),

  search: (params: { q: string; page: number; size: number }) =>
    queryOptions<{
      memberInfos: Page<Member>;
    }>({
      queryKey: memberQueries.searchKey(params),
      queryFn: () =>
        getMembersPage({
          column: 'id',
          keyword: params.q,
          page: params.page,
          size: params.size,
        }),
    }),
};
