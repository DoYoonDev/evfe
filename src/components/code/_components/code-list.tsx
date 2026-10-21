import { ColumnDef, Table } from '@tanstack/react-table';

import { DataTable } from '@/components/custom-ui';
import type { Code } from '@/types/admin/code.ts';

export const CodeList = ({
  table,
  columns,
}: {
  table: Table<Code>;
  columns: ColumnDef<Code>[];
}) => {
  return (
    <>
      {/* LIST */}
      <DataTable table={table} columns={columns} />
    </>
  );
};
