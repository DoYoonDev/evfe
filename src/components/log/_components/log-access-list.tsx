import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useMemo } from 'react'
import { DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';

import { LoadingErrorFallback, PageablePagination } from '@/components/common';
import { DataTable } from '@/components/custom-ui';
import { logAccessQueries } from '@/queries/admin/log';

import { AccessLogColumns } from './log-access-columns';
import { AccessLogSearch } from './log-access-search';

type SortDirection = 'asc' | 'desc';

type Props = {
  // 검색 입력 상태
  userId: string;
  setUserId: (v: string) => void;
  accessedAt: DateRange | undefined;
  setAccessedAt: (v: DateRange | undefined) => void;
  onSearch: () => void;
  onKeywordKeyDown: React.KeyboardEventHandler<HTMLInputElement>;

  // 확정된 검색 조건
  searchUserId: string | undefined;
  searchAccessedAt: DateRange | undefined;

  // 페이징
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;

  // 정렬
  sortField?: string;
  sortDirection?: SortDirection;
  onSortChange: (field?: string, direction?: SortDirection) => void;
}

export const AccessLogList = ({
  // 입력 상태
  userId,
  setUserId,
  accessedAt,
  setAccessedAt,
  onSearch,
  onKeywordKeyDown,

  // 검색 조건
  searchUserId,
  searchAccessedAt,

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

  // 달력UI 기본값 최근 한달내로 세팅
  useEffect(() => {
    if (!accessedAt?.from && !accessedAt?.to) {
      const now = new Date();
      const defaultTo = new Date(); // 오늘
      const defaultFrom = new Date(now.setDate(now.getDate() - 30)); // 30일 전

      setAccessedAt({
        from: defaultFrom || undefined,
        to: defaultTo || undefined,
      });
    }
  }, []);

  const { start: defaultStartISO, end: defaultEndISO } = useMemo(() => {
    const now = new Date();
    const end = new Date().toISOString();
    const start = new Date(now.setDate(now.getDate() - 30)).toISOString();
    
    return { start, end };
  }, []);

  // 검색 파라미터
  const filter = useMemo(() => {
    const safeCurrent = Number.isFinite(currentPage) ? currentPage! : 1;
    const safeSize = Number.isFinite(itemsPerPage) ? itemsPerPage! : 10;

    const _userId = searchUserId?.trim();
    const _accessedAtStart = searchAccessedAt?.from?.toISOString();
    const _accessedAtEnd = searchAccessedAt?.to?.toISOString();
    const _sortField = sortField?.trim();
    const _sortDir: SortDirection | undefined = _sortField
      ? (sortDirection === 'desc' ? 'desc' : 'asc')
      : undefined;

    return {
      page: Math.max(0, safeCurrent - 1),
      size: Math.max(1, safeSize),
      memberId: _userId || undefined,
      accessedAtStart: _accessedAtStart ? _accessedAtStart : defaultStartISO,
      accessedAtEnd: _accessedAtEnd ? _accessedAtEnd : defaultEndISO,
      sortField: _sortField || undefined,
      sortDir: _sortDir,
      sort: _sortField && _sortDir ? `${_sortField},${_sortDir}` : undefined,
    } as const;
  }, [searchUserId, searchAccessedAt, sortField, sortDirection, itemsPerPage, currentPage, defaultStartISO, defaultEndISO]);

  // 접근로그 목록 조회
  const { data: logAccessInfos, isLoading, isError } = useQuery({
    ...logAccessQueries.listPage(filter),
    select: (response) => response.logAccessInfos,
    placeholderData: (prev) => prev,
  });

  const accessLogs = logAccessInfos?.content ?? [];
  const totalCount = logAccessInfos?.totalElements ?? 0;
  const totalPages = logAccessInfos?.totalPages ?? 0;

  const baseColumns = useMemo(() => AccessLogColumns(t), [t]);
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
    data: accessLogs,
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
        // 정렬 해제
        onSortChange(undefined,undefined);
        return;
      }
      onSortChange(first.id, first.desc ? 'desc' : 'asc');
    },
  });

  if (isLoading) {
    return <LoadingErrorFallback status="loading" />;
  }
  if (isError)  {
    return <LoadingErrorFallback status="error" />;
  }

  const paging = Math.max(0, (currentPage ?? 1) - 1);
  const size = Math.max(1, itemsPerPage ?? 20);

  return (
    <div className='space-y-4'>
      {/* 입력값 전달 */}
      <AccessLogSearch
        userId={userId}
        setUserId={setUserId}
        accessedAt={accessedAt}
        setAccessedAt={setAccessedAt}
        onSearch={onSearch}
        onKeyDown={onKeywordKeyDown}
      />

      <DataTable
        table={table}
        columns={columns}
      />

      <PageablePagination
        page={paging}
        size={size}
        totalPages={totalPages}
        totalElements={totalCount}
        onPageChange={(cp) => onPageChange(cp + 1)}
        onSizeChange={(nextSize) => {
          onItemsPerPageChange(nextSize);
          onPageChange(1);
        }}
        isLoading={isLoading}
        showPageSize={true}
      />
    </div>
  )
};
