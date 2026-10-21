import {
  Pagination as SPagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils.ts';

import { useCodeDispatch, useCodeState } from '../_hooks/use-code.tsx';

export const CodePagination = ({
  isFirst,
  isLast,
  className,
}: {
  currentPage: number;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}) => {
  const { code } = useCodeState();
  const dispatch = useCodeDispatch();

  const handlePageClick = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <SPagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (isFirst) return;

              handlePageClick(code.page - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>{code.page + 1}</PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (isLast) return;

              handlePageClick(code.page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </SPagination>
  );
};
