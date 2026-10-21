import { ColumnDef, Table } from '@tanstack/react-table';

import { DataTable } from '@/components/custom-ui';
import { CodeGroup } from '@/types/admin/code.ts';

export const CodeGroupList = ({
  table,
  columns,
  onRowClick,
}: {
  table: Table<CodeGroup>;
  columns: ColumnDef<CodeGroup>[];
  onRowClick?: (id: string) => void;
}) => {
  return (
    <>
      <DataTable
        table={table}
        columns={columns}
        onRowClick={(row) => {
          if (onRowClick) {
            onRowClick(row.id);
          }
        }}
      />
    </>
  );
};
