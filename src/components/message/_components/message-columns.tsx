import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';

import type { Message } from '@/types/admin/message.ts';

export const MessageColumns = (t: TFunction): ColumnDef<Message>[] => [
  {
    accessorKey: 'id',
    header: t('col.message.id', { defaultValue: '메시지 아이디' }),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'koText',
    header: t('col.message.ko', { defaultValue: '메시지-한국어' }),
    cell: ({ row }) => <div>{row.getValue('koText')}</div>,
  },
  {
    accessorKey: 'enText',
    header: t('col.message.en', { defaultValue: '메시지-영어' }),
    cell: ({ row }) => <div>{row.getValue('enText')}</div>,
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
    accessorKey: 'updateMemberId',
    header: t('col.last.modifier', { defaultValue: '최종수정자' }),
    cell: ({ row }) => <div>{row.getValue('updateMemberId')}</div>,
  },
  {
    accessorKey: 'updatedAt',
    header: t('col.last.modified.date', { defaultValue: '최종수정일' }),
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('updatedAt')).format('YYYY-MM-DD HH:mm')}</div>
    ),
  },
];
