import { ColumnDef, HeaderContext } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { type TFunction } from 'i18next';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { LogAccess } from '@/types/admin/log-access.ts';

import { LogFieldCell } from './log-field-cell';

type I18nMeta ={
  labelKey: string;
  searchable?: boolean;
}

type ColumnWithMeta = ColumnDef<LogAccess> & {
  accessorKey: keyof LogAccess & string;
  meta?: I18nMeta;
}

// 공통 정렬 헤더
const makeSortableHeader =
  (t: TFunction, labelKey: string, defaultValue: string) =>
  ({ column }: HeaderContext<LogAccess, unknown>) => (
    <div
      className='cursor-pointer select-none flex items-center gap-1 font-semibold'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {t(labelKey, { defaultValue })}
      {column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
      {column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
    </div>
  );

export const AccessLogColumns = (t: TFunction): ColumnWithMeta[] => [
  {
    accessorKey: 'id',
    header: makeSortableHeader(t, "col.log.id", "번호"),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.id', searchable: false },
  },
  {
    accessorKey: 'memberId',
    header: makeSortableHeader(t, "col.log.memberId", "사용자 아이디"),
    cell: ({ row }) => <div>{row.getValue('memberId')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.memberId', searchable: true },
  },
  {
    accessorKey: 'requestUrl',
    header: makeSortableHeader(t, "col.log.requestUrl", "요청 URL"),
    cell: ({ row }) => (
      <div className="whitespace-pre-wrap break-words max-w-full">
        {row.getValue('requestUrl')}
      </div>
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.requestUrl', searchable: false },
  },
  {
    accessorKey: 'requestMethod',
    header: makeSortableHeader(t, "col.log.requestMethod", "요청 메서드"),
    cell: ({ row }) => <div>{row.getValue('requestMethod')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.requestMethod', searchable: false },
  },
  {
    accessorKey: 'requestPayload',
    header: makeSortableHeader(t, "col.log.requestPayload", "요청 페이로드"),
    cell: ({ row }) => (
      <LogFieldCell
        value={row.getValue("requestPayload")}
        label="Request Payload"
        width="w-36"
      />
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.requestPayload', searchable: false },
  },
  {
    accessorKey: 'requestIp',
    header: makeSortableHeader(t, "col.log.requestIp", "접속 IP"),
    cell: ({ row }) => <div>{row.getValue('requestIp')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.requestIp', searchable: false },
  },
  {
    accessorKey: 'responseStatus',
    header: makeSortableHeader(t, "col.log.responseStatus", "응답 상태"),
    cell: ({ row }) => <div>{row.getValue('responseStatus')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.responseStatus', searchable: false },
  },
  {
    accessorKey: 'responseBody',
    header: makeSortableHeader(t, "col.log.responseBody", "응답 바디"),
    cell: ({ row }) => (
      <LogFieldCell
        value={row.getValue("responseBody")}
        label="Request Payload"
        width="w-36"
      />
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.responseBody', searchable: false },
  },
  {
    accessorKey: 'createdAt',
    header: makeSortableHeader(t, "col.log.createdAt", "생성일"),
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')}</div>
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.createdAt', searchable: true},
  },
];
