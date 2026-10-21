import { useCallback, useState } from 'react';

type SortDirection = 'asc' | 'desc';

type MemberSearchParams = {
  searchColumn: string;
  searchKeyword: string;
  currentPage: number;
  itemsPerPage: number;
  sortField?: string;
  sortDirection?: SortDirection;
};

export const useMemberState = (componentType?: string) => {
  const initialSelected = (componentType ? 'title' : 'id');

  // 입력용 상태
  const [inputKeyword, setInputKeyword] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(initialSelected);

  // 검색 파라미터 상태
  const [searchParams, setSearchParams] = useState<MemberSearchParams>({
    searchColumn: initialSelected,
    searchKeyword: '',
    currentPage: 1,
    itemsPerPage: 10,
    sortField: undefined,
    sortDirection: undefined,
  });

   // 검색 트리거
  const triggerSearch = useCallback(() => {
    setSearchParams((prev) => ({
      ...prev,
      searchKeyword: inputKeyword.trim(),
      searchColumn: selectedColumn.trim(),
      currentPage: 1,
    }));
  }, [inputKeyword, selectedColumn]);

  // 페이지 이동
  const changePage = useCallback((page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      currentPage: Math.max(1, page),
    }));
  }, []);

  // 페이지 Size 변경
  const changeItemsPerPage = useCallback((size: number) => {
    setSearchParams((prev) => ({
      ...prev,
      itemsPerPage: size,
      currentPage: 1,
    }));
  }, []);

  // 정렬 변경
  const changeSort = useCallback((field?: string, direction?: SortDirection) => {
    setSearchParams((prev) => {
      const normalizedField = field?.trim();
      if (!normalizedField) {
        return { ...prev, sortField: undefined, sortDirection: undefined, currentPage: 1 };
      }
      const isSame = prev.sortField === normalizedField;
      const nextDirection: SortDirection =
        direction ?? (isSame ? (prev.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');

      return {
        ...prev,
        sortField: normalizedField,
        sortDirection: nextDirection,
        currentPage: 1,
      };
    });
  }, []);
  
  // Enter 키로 검색
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        triggerSearch();
      }
    },
    [triggerSearch]
  );

   return {
    inputKeyword,
    setInputKeyword,
    selectedColumn,
    setSelectedColumn,
    handleKeyDown,
    searchParams,
    setSearchParams,
    triggerSearch,
    changePage,
    changeItemsPerPage,
    changeSort,
  };
};
