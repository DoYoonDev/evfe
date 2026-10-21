import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: Props) => {
  const handleItemsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = parseInt(e.target.value, 10);
      onItemsPerPageChange(newSize); 
    },
    [onItemsPerPageChange]
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
      {/* 총 건수 */}
      <div className="text-muted-foreground">
        {typeof totalItems === 'number' && `Total ${totalItems}`}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex items-center gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          «
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </Button>
        <div className="px-2">
          {currentPage} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          »
        </Button>
      </div>

      {/* 페이지당 항목 수 선택 */}
      <div className="flex items-center gap-2">
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="rounded border px-2 py-1"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
