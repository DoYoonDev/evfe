import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Align = 'left' | 'center' | 'right';

type Props = {
  page: number;                  // 0-based
  size: number;
  totalPages?: number;           // 백엔드가 주는 totalPages
  totalElements?: number;        // 없으면 이걸로 pageCount 계산
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  isLoading?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  align?: Align;
  className?: string;
};

export const PageablePagination = ({
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  isLoading = false,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  align = 'center',
  className,
}: Props) => {
  const pageCount =
    typeof totalPages === 'number'
      ? Math.max(0, totalPages)
      : Math.max(0, Math.ceil((totalElements ?? 0) / Math.max(1, size)));
  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  const goFirst = () => onPageChange(0);
  const goPrev = () => onPageChange(Math.max(0, page - 1));
  const goNext = () => onPageChange(Math.min(Math.max(0, pageCount - 1), page + 1));
  const goLast = () => onPageChange(Math.max(0, pageCount - 1));

  const alignClass =
    align === 'left' ? 'justify-self-start' :
    align === 'right' ? 'justify-self-end' : 'justify-self-center';

  return (
    <div className={clsx('w-full grid grid-cols-3 items-center gap-3', className)}>
      {/* 좌: 총 건수 */}
      <div className="text-sm text-muted-foreground">
        {isLoading
          ? 'Loading...'
          : typeof totalElements === 'number'
            ? `Total ${totalElements.toLocaleString()}`
            : `Pages ${pageCount.toLocaleString()}`}
      </div>

      {/* 중: 페이지 버튼 */}
      <div className={clsx('flex items-center gap-2', alignClass)}>
        <Button variant="outline" size="sm" onClick={goFirst} disabled={isLoading || !canPrev || pageCount <= 0} aria-label="First page">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goPrev} disabled={isLoading || !canPrev} aria-label="Prev page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm tabular-nums min-w-[72px] text-center">
          {pageCount > 0 ? page + 1 : 0} / {pageCount > 0 ? pageCount : 0}
        </span>
        <Button variant="outline" size="sm" onClick={goNext} disabled={isLoading || !canNext} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goLast} disabled={isLoading || pageCount <= 0 || !canNext} aria-label="Last page">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 우: 페이지 크기 */}
      <div className="flex justify-end">
        {showPageSize && (
          <Select value={String(size)} onValueChange={(v) => onSizeChange(Number(v))}>
            <SelectTrigger className="w-[72px] ml-auto">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(s => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select> 
        )}
      </div>
    </div>
  );
}
