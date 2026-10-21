import {
  CellContext,
  type ColumnDef,
  ColumnMeta,
  flexRender,
  type Table as TTable,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import { cn } from '@/lib/utils';

type TableCellProps = React.HTMLAttributes<HTMLTableCellElement>;

interface CustomColumnMeta<TData, TValue = unknown> extends ColumnMeta<TData, TValue> {
  getCellContext?: (context: CellContext<TData, TValue>) => TableCellProps;
}

type WithUrl = { url?: string };

const hasUrl = (v: unknown): v is WithUrl => {
  if (typeof v !== 'object' || v === null) return false;
  const obj = v as Record<string, unknown>;
  return typeof obj.url === 'string' && obj.url.length > 0;
};

export const DataTable = <TData, TValue>({
  table,
  columns,
  className,
  onRowClick,
  getRowClassName,
}: {
  table: TTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  className?: string;
  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData) => string;
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn(className)}>
      <div className="rounded-md border">
        <Table className="table-auto w-full [&_th]:whitespace-nowrap">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick ? 'cursor-pointer' : '',
                    getRowClassName?.(row.original),
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as CustomColumnMeta<
                      TData,
                      TValue
                    >;
                    const cellProps = meta?.getCellContext
                      ? meta.getCellContext(cell.getContext())
                      : {};

                    const content = flexRender(cell.column.columnDef.cell, cell.getContext());

                    return (
                      <TableCell key={cell.id} {...cellProps}>
                        {hasUrl(row.original) ? <Link to={row.original.url!}>{content}</Link> : content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center font-medium text-gray-500"
                >
                  {t('msg.no.data', {
                    defaultValue: '데이터가 존재하지 않습니다.',
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
