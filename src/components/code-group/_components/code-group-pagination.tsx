import { useCodeDispatch } from '@/components/code';
import {
  Pagination as SPagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils.ts';

import { useCodeGroupState } from '../_hooks/use-code-group.tsx';

export const CodeGroupPagination = ({
  isFirst,
  isLast,
  className,
}: {
  currentPage: number;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}) => {
  const { codeGroup } = useCodeGroupState();
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

              handlePageClick(codeGroup.page - 1);
            }}
          />
        </PaginationItem>
        <PaginationItem>{codeGroup.page + 1}</PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (isLast) return;

              handlePageClick(codeGroup.page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </SPagination>
  );
};
