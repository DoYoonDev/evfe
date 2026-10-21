import type { ColumnDef, HeaderContext } from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { LogLogin } from '@/types/admin/log-login';

type I18nMeta = {
  labelKey: string;
  searchable?: boolean;
};

type ColumnWithMeta = ColumnDef<LogLogin> & {
  accessorKey: keyof LogLogin & string;
  meta?: I18nMeta;
};

/** 공통 정렬 헤더 (중복 제거) */
const makeSortableHeader =
  (t: TFunction, labelKey: string, defaultValue: string) =>
  ({ column }: HeaderContext<LogLogin, unknown>) => (
    <div
      className="cursor-pointer select-none flex items-center gap-1 font-semibold"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {t(labelKey, { defaultValue })}
      {column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
      {column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
    </div>
  );

export const LoginLogColumns = (t: TFunction): ColumnWithMeta[] => [
  {
    accessorKey: 'id',
    header: makeSortableHeader(t, 'col.log.id', '번호'),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.id', searchable: false },
  },
  {
    accessorKey: 'memberId',
    header: makeSortableHeader(t, 'col.log.memberId', '사용자 ID'),
    cell: ({ row }) => <div>{row.getValue('memberId')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.memberId', searchable: true },
  },
  {
    accessorKey: 'accessIp',
    header: makeSortableHeader(t, 'col.log.login.accessIp', '접근 IP'),
    cell: ({ row }) => <div>{row.getValue('accessIp')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.log.login.accessIp', searchable: true },
  },
  {
    accessorKey: 'success',
    header: makeSortableHeader(t, 'col.log.login.success', '로그인 성공 여부'),
    cell: ({ row }) => (
      <div>
        {row.getValue('success') ? 'Success' : 'Fail'}
      </div>
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.login.success', searchable: true },
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')}</div>
    ),
    enableSorting: true,
    meta: { labelKey: 'col.log.login.accessDate', searchable: false },
  },
];

// const prettifyKey = (key: string) =>
//   key
//     .replace(/([a-z])([A-Z])/g, '$1 $2')
//     .replace(/_/g, ' ')
//     .replace(/\b\w/g, (s) => s.toUpperCase());

// /**
//  * 검색용 옵션 추출 (다국어 지원)
//  */
// export const getSearchableLogLoginColumns = (
//   t: TFunction,
//   opts?: {
//     include?: Array<keyof LogLogin & string>;
//     exclude?: Array<keyof LogLogin & string>;
//     allowAll?: boolean;
//   },
// ) => {
//   const cols = logLoginColumns(t);

//   const baseExcluded: Array<keyof LogLogin & string> = opts?.allowAll
//     ? []
//     : (['isActive', 'createdAt'] as Array<keyof LogLogin & string>);

//   const includeSet = new Set(opts?.include ?? []);
//   const excludeSet = new Set([...(opts?.exclude ?? []), ...baseExcluded]);

//   // 필터링
//   const filtered = cols.filter((col): col is ColumnWithMeta => {
//     const key = col.accessorKey;
//     if (!key || typeof key !== 'string') return false;
//     // include가 지정되면 include에만 허용
//     if (includeSet.size > 0 && !includeSet.has(key)) return false;
//     // exclude 우선 제외
//     if (excludeSet.has(key)) return false;
//     // meta.searchable이 false면 제외
//     if (col.meta && col.meta.searchable === false) return false;
//     return true;
//   });

//   const options = filtered.map((col) => {
//     const key = col.accessorKey;
//     const labelKey = col.meta?.labelKey;
//     const label = labelKey
//       ? t(labelKey, { defaultValue: prettifyKey(key) })
//       : 
//         prettifyKey(key);

//     return { value: key, label };
//   });

//   return options;
  // 정렬
  //return options.sort((a, b) => a.label.localeCompare(b.label));
// };

