import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";

type SortDirection = 'asc' | 'desc';

type AccessLogSearchParams = {
    searchUserId: string;
    searchAccessedAt: DateRange | undefined;
    currentPage: number;
    itemsPerPage: number;
    sortField?: string;
    sortDirection?: SortDirection;
};

export const useAccessLogState = () => {
    // 입력 상태
    const [userId, setUserId] = useState('');
    const [accessedAt, setAccessedAt] = useState<DateRange | undefined>(undefined);

    // 검색 파라미터 상태
    const [searchParams, setSearchParams] = useState<AccessLogSearchParams>({
        searchUserId: '',
        searchAccessedAt: undefined,
        currentPage: 1,
        itemsPerPage: 10,
        sortField: undefined,
        sortDirection: undefined,
    });

    // 검색
    const triggerSearch = useCallback(() => {
        setSearchParams((prev) => ({
            ...prev,
            searchUserId: userId.trim(),
            searchAccessedAt: accessedAt,
            currentPage: 1,
        }));
    }, [userId, accessedAt]);

    // 페이지 이동
    const changePage = useCallback((page: number) => {
        setSearchParams((prev) => ({
            ...prev,
            currentPage: Math.max(1, page),
        }));
    }, []);

    // 페이지 사이즈 변경
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
                return {
                    ...prev,
                    sortField: undefined,
                    sortDirection: undefined,
                    currentPage: 1,
                };
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

    // 엔터키로 검색
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            triggerSearch();
        }
    }, [triggerSearch]);

    return {
        userId,
        setUserId,
        accessedAt,
        setAccessedAt,
        searchParams,
        setSearchParams,
        changePage,
        changeItemsPerPage,
        changeSort,
        handleKeyDown,
        triggerSearch,
    };
};