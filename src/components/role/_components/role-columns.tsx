import { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { Role } from '@/types/admin/role.ts';

export const RoleColumns = (t: TFunction): ColumnDef<Role>[] => [
  {
    accessorKey: 'name',
    header: () => t('col.role.name', { defaultValue: '권한명' }),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
];
