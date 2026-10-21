import { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { FileTextIcon } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button.tsx';
import type { CodeGroup } from '@/types/admin/code.ts';

export const CodeGroupColumns = (t: TFunction): ColumnDef<CodeGroup>[] => [
  {
    accessorKey: 'id',
    header: t('col.code.id', { defaultValue: '코드 아이디' }),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: t('col.code.name',{ defaultValue: '코드명' }),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: t('col.code.desc', { defaultValue: '코드 설명' }),
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: t('col.isActive', { defaultValue: '사용여부' }),
    cell: ({ row }) => (
      <div>
        {row.getValue('isActive')
          ? t('common.enabled', { defaultValue: 'Enabled' })
          : t('common.disabled', { defaultValue: 'Disabled' })}
      </div>
    ),
  },
  {
    header: t('col.action', { defaultValue: 'Action' }),
    cell: ({ row }) => (
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <Link to={`/system/code/code-group/${row.getValue('id')}`}>
          <FileTextIcon className="h-4 w-4" />
          {t('btn.detail', { defaultValue: '상세' })}
        </Link>
      </Button>
    ),
  },
];
