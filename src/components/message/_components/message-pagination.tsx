import {
  Pagination as SPagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils.ts';

import { useMessageDispatch, useMessageState } from '../_hooks/use-message.tsx';

export const MessagePagination = ({
  isFirst,
  isLast,
  className,
}: {
  currentPage: number;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}) => {
  const { page } = useMessageState();
  const dispatch = useMessageDispatch();

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

              handlePageClick(page - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>{page + 1}</PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (isLast) return;

              handlePageClick(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </SPagination>
  );
};
