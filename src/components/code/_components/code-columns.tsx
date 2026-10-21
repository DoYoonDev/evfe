import { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { Code } from '@/types/admin/code';

export const CodeColumns = (t: TFunction): ColumnDef<Code>[] => [
  {
    accessorKey: 'id',
    header: t('col.code.id', { defaultValue: '코드 아이디' }),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'messageId',
    header: t('col.message.id', { defaultValue: '메시지 아이디' }),
    cell: ({ row }) => <div>{row.getValue('messageId')}</div>,
  },
  {
    accessorKey: 'name',
    header: t('col.code.name', { defaultValue: '코드명' }),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: t('col.code.desc', { defaultValue: '코드 설명' }),
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'sortOrder',
    header: t('col.code.sortOrder', { defaultValue: '정렬 순서' }),
    cell: ({ row }) => <div>{row.getValue('sortOrder')}</div>,
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
];
