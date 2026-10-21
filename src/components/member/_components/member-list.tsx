import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LoadingErrorFallback, PageablePagination } from '@/components/common';
import { DataTable } from '@/components/custom-ui';
import { MemberColumns, MemberSearch } from '@/components/member';
import { memberQueries } from '@/queries/member/member';

type SortDirection = 'asc' | 'desc';

type Props = {
  // 검색 입력 상태
  inputKeyword: string;
  setInputKeyword: (v: string) => void;
  selectedColumn: string;
  setSelectedColumn: (v: string) => void;
  onSearch: () => void;
  onKeywordKeyDown: React.KeyboardEventHandler<HTMLInputElement>;

  // 확정된 검색 조건
  searchKeyword: string | undefined;
  searchColumn: string | undefined;

  // 페이징
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;

  // 정렬
  sortField?: string;
  sortDirection?: SortDirection;
  onSortChange: (field?: string, direction?: SortDirection) => void;
};

export const MemberList = ({
  // 입력 상태
  inputKeyword,
  setInputKeyword,
  selectedColumn,
  setSelectedColumn,
  onSearch,
  onKeywordKeyDown,

  // 확정된 검색 조건
  searchKeyword,
  searchColumn,

  // 페이징
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,

  // 정렬
  sortField,
  sortDirection,
  onSortChange,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 검색 파라미터
  const filter = useMemo(() => {
    const safeCurrent = Number.isFinite(currentPage) ? currentPage! : 1;
    const safeSize    = Number.isFinite(itemsPerPage) ? itemsPerPage! : 10;

    const _column = searchColumn?.trim() || undefined;
    const _keyword = searchKeyword?.trim() || undefined;
    const _sortField = sortField?.trim();
    const _sortDir: SortDirection | undefined =
      _sortField ? (sortDirection === 'desc' ? 'desc' : 'asc') : undefined;

    return {
      page: Math.max(0, safeCurrent - 1),
      size: Math.max(1, safeSize),
      column: _column,
      keyword: _keyword,
      sort: _sortField && _sortDir ? `${_sortField},${_sortDir}` : undefined,
    } as const;
  }, [searchColumn, searchKeyword, currentPage, itemsPerPage, sortField, sortDirection]);

  // 멤버 목록 조회
  const { data: memberInfos, isLoading, isError, isFetching } = useQuery({
    ...memberQueries.listPage(filter),
    select: (resp) => resp.memberInfos,
    placeholderData: (prev) => prev,
  });

  const members = memberInfos?.content ?? [];
  const totalCount = memberInfos?.totalElements ?? 0;
  const totalPages = memberInfos?.totalPages ?? 0;

  const baseColumns = useMemo(() => MemberColumns(t), [t]);
  const columns = useMemo(
    () => baseColumns.map(col => ({ ...col, enableSorting: col.enableSorting ?? true })),
    [baseColumns]
  );

  // 정렬 상태
  const sorting: SortingState = useMemo(
    () => (sortField ? [{ id: sortField, desc: sortDirection === 'desc' }] : []),
    [sortField, sortDirection]
  );

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: totalCount,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      const first = next[0];
      if (!first) {
        onSortChange(undefined, undefined); // 정렬 해제
        return;
      }
      onSortChange(first.id, first.desc ? 'desc' : 'asc');
    },
  });

  if (isLoading) {
    return <LoadingErrorFallback status="loading" />;
  }
  if (isError && !memberInfos) {
    return <LoadingErrorFallback status="error" />;
  }

  const page0 = Math.max(0, (currentPage ?? 1) - 1);
  const size  = Math.max(1, itemsPerPage ?? 20);

  return (
    <div className="space-y-4">
      {/* 입력값만 전달 */}
      <MemberSearch
        inputKeyword={inputKeyword}
        setInputKeyword={setInputKeyword}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        onSearch={onSearch}
        onKeyDown={onKeywordKeyDown}
      />
      <DataTable
        table={table}
        columns={columns}
        onRowClick={(row) => navigate(`/system/members/${row.id}`)}
      />
      <PageablePagination
        page={page0}
        size={size}
        totalPages={totalPages}
        totalElements={totalCount}
        onPageChange={(p0) => onPageChange(p0 + 1)}
        onSizeChange={(nextSize) => {
          onItemsPerPageChange(nextSize);
          onPageChange(1);
        }}
        isLoading={isLoading || isFetching}
        showPageSize={true}
      />
    </div>
  );
};
