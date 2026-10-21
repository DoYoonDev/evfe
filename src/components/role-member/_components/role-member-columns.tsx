import { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import type { RoleMember } from '@/types/admin/role.ts';

export const RoleMemberColumns = (
  t: TFunction,
  onDelete: (memberId: string) => void,
): ColumnDef<RoleMember>[] => [
  {
    accessorKey: 'memberId',
    header: t('col.member.id', { defaultValue: '사용자 ID' }),
    cell: ({ getValue }) => <div className="font-mono">{String(getValue() ?? '')}</div>,
  },
  {
    accessorKey: 'koName',
    header: t('col.member.koName', { defaultValue: '이름 (한글)' }),
    cell: ({ getValue }) => <div>{String(getValue() ?? '')}</div>,
  },
  {
    accessorKey: 'enName',
    header: t('col.member.koName', { defaultValue: '이름 (영문)' }),
    cell: ({ getValue }) => <div>{String(getValue() ?? '')}</div>,
  },
  {
    id: 'actions',
    header: t('col.actions', { defaultValue: 'Action' }),
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original.memberId)}
          aria-label={t('btn.delete', { defaultValue: '삭제' })}
        >
          <Trash2Icon className="h-4 w-4" />
          {t('btn.delete', { defaultValue: '삭제' })}
        </Button>
      </div>
    ),
  },
];
