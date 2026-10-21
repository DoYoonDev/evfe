import type { ColumnDef, HeaderContext } from '@tanstack/react-table';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { Member } from '@/types/admin/member';

type I18nMeta = {
  labelKey: string;
  searchable?: boolean;
};

type ColumnWithMeta = ColumnDef<Member> & {
  accessorKey: keyof Member & string;
  meta?: I18nMeta;
};

/** 공통 정렬 헤더 (중복 제거) */
const makeSortableHeader =
  (t: TFunction, labelKey: string, defaultValue: string) =>
  ({ column }: HeaderContext<Member, unknown>) => (
    <div
      className="cursor-pointer select-none flex items-center gap-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {t(labelKey, { defaultValue })}
      {column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
      {column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
    </div>
  );

export const MemberColumns = (t: TFunction): ColumnWithMeta[] => [
  {
    accessorKey: 'id',
    header: makeSortableHeader(t, 'col.member.id', '사용자 ID'),
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.member.id', searchable: true },
  },
  {
    accessorKey: 'koName',
    header: makeSortableHeader(t, 'col.member.koName', '이름(한글)'),
    cell: ({ row }) => <div>{row.getValue('koName')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.member.koName', searchable: true },
  },
  {
    accessorKey: 'enName',
    header: makeSortableHeader(t, 'col.member.enName', '이름(영문)'),
    cell: ({ row }) => <div>{row.getValue('enName')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.member.enName', searchable: true },
  },
  {
    accessorKey: 'email',
    header: makeSortableHeader(t, 'col.member.email', '이메일'),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    enableSorting: true,
    meta: { labelKey: 'col.member.email', searchable: true },
  },
  {
    accessorKey: 'isActive',
    header: makeSortableHeader(t, 'col.member.isActive', '활성화 여부'),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive');
      return (
        <div>
          {isActive
            ? t('col.member.activate', { defaultValue: '활성화' })
            : t('col.member.deactivate', { defaultValue: '비활성화' })}
        </div>
      );
    },
    enableSorting: true,
    meta: { labelKey: 'col.member.isActive', searchable: false },
  },
  {
    accessorKey: 'createdAt',
    header: makeSortableHeader(t, 'col.member.createdAt', '생성일'),
    cell: ({ row }) => (
      <div>{dayjs(row.getValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')}</div>
    ),
    enableSorting: true,
    meta: { labelKey: 'col.member.createdAt', searchable: false },
  },
];

const prettifyKey = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (s) => s.toUpperCase());

/**
 * 검색용 옵션 추출 (다국어 지원)
 */
export const getSearchableMemberColumns = (
  t: TFunction,
  opts?: {
    include?: Array<keyof Member & string>;
    exclude?: Array<keyof Member & string>;
    allowAll?: boolean;
  },
) => {
  const cols = MemberColumns(t);

  const baseExcluded: Array<keyof Member & string> = opts?.allowAll
    ? []
    : (['isActive', 'createdAt'] as Array<keyof Member & string>);

  const includeSet = new Set(opts?.include ?? []);
  const excludeSet = new Set([...(opts?.exclude ?? []), ...baseExcluded]);

  // 필터링
  const filtered = cols.filter((col): col is ColumnWithMeta => {
    const key = col.accessorKey;
    if (!key || typeof key !== 'string') return false;
    // include가 지정되면 include에만 허용
    if (includeSet.size > 0 && !includeSet.has(key)) return false;
    // exclude 우선 제외
    if (excludeSet.has(key)) return false;
    // meta.searchable이 false면 제외
    if (col.meta && col.meta.searchable === false) return false;
    return true;
  });

  const options = filtered.map((col) => {
    const key = col.accessorKey;
    const labelKey = col.meta?.labelKey;
    const label = labelKey
      ? t(labelKey, { defaultValue: prettifyKey(key) })
      : 
        prettifyKey(key);

    return { value: key, label };
  });

  return options;
  // 정렬
  //return options.sort((a, b) => a.label.localeCompare(b.label));
};
