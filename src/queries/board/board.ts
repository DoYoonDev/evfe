import { getBoardDetail, getBoardPage, getBoards } from "@/api/board";
import { QUERY_KEYS } from "@/constants/query-key";
import { Board, BoardListFilter } from "@/types/common/board";
import { queryOptions } from "@tanstack/react-query";

const ROOT_KEY = [QUERY_KEYS.BOARDS];

export const boardQueries = {
  // 공통
  all: () => ROOT_KEY,
  listKey: () => [...ROOT_KEY, QUERY_KEYS.LIST],
  listPageKey: (filter: BoardListFilter) => {
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

  // 목록 조회
  list: () =>
    queryOptions<Board[]>({
      queryKey:  boardQueries.listKey(),
      queryFn: async () => {
        const res = await getBoards();
        return res.boardInfos;
      },
    }),

  listPage: (filter: BoardListFilter) => 
    queryOptions<{
      boardInfos: Board[];
      totalElements: number;
      totalPages: number;
    }> ({
      queryKey: boardQueries.listPageKey(filter),
      queryFn: () => 
        getBoardPage(filter),
    }),

  // 상세조회
  detail: (id: string) => 
    queryOptions<Board>({
      queryKey: boardQueries.detailKey(id),
      queryFn: () => getBoardDetail(id),
    }),
};
