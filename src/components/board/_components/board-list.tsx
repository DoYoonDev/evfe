import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { LoadingErrorFallback, PageablePagination } from "@/components/common";
import { DataTable } from "@/components/custom-ui/_components/data-table";
import { boardQueries } from "@/queries/board/board";

import { BoardColumns } from "./board-columns";
import { BoardSearch } from "./board-search";

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

export const BoardList = ({
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
    const _column = searchColumn?.trim();
    const _keyword = searchKeyword?.trim();
    const _sortField = sortField?.trim();
    const _sortDir: SortDirection | undefined = _sortField
      ? (sortDirection === 'desc' ? 'desc' : 'asc')
      : undefined;

    return {
      page: Math.max(0, currentPage - 1),
      size: itemsPerPage,
      column: _column || undefined,
      keyword: _keyword || undefined,
      sortField: _sortField || undefined,
      sortDirection: _sortDir,
      sort: _sortField && _sortDir ? `${_sortField},${_sortDir}` : undefined,
    } as const;
  }, [searchColumn, searchKeyword, currentPage, itemsPerPage, sortField, sortDirection]);

  // 게시글 목록 조회
  const { data, isLoading, isError, isFetching } = useQuery(boardQueries.listPage(filter));

  const boards = data?.boardInfos ?? [];
  const totalCount = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const baseColumns = useMemo(() => BoardColumns(t, currentPage, itemsPerPage), [t, currentPage, itemsPerPage]);
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
    data: boards,
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
        onSortChange(undefined, undefined);
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

  const page0 = Math.max(0, (currentPage ?? 1) - 1);
  const size = Math.max(1, itemsPerPage ?? 20);

  return (
    <div className="space-y-4">
      <BoardSearch
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
        onRowClick={(row) => navigate(`/board/${row.id}`)}
        getRowClassName={(row) =>
          row.isPin
            ? "bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] font-medium"
            : ""
        }
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
  )
}