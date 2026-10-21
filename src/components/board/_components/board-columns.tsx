import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { ArrowDown, ArrowUp, Paperclip } from "lucide-react";

import type { Board } from "@/types/common/board";

type I18nMeta = {
  labelKey: string;
  searchable?: boolean;
};

type ColumnWithMeta = ColumnDef<Board> & {
  accessorKey: keyof Board & string;
  meta?: I18nMeta;
};

/** 공통 정렬 헤더 (중복 제거) */
const makeSortableHeader =
  (t: TFunction, labelKey: string, defaultValue: string) =>
    ({ column }: HeaderContext<Board, unknown>) => (
      <div
        className="cursor-pointer select-none flex items-center gap-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t(labelKey, { defaultValue })}
        {column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
        {column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
      </div>
    );

/** Board 테이블 컬럼 정의 */
export const BoardColumns = (
  t: TFunction,
  currentPage: number = 0,
  itemsPerPage: number = 0
): ColumnWithMeta[] => [
    {
      accessorKey: "rowNumber",
      header: "No",
      cell: ({ row }) => <div>{(currentPage - 1) * itemsPerPage + row.index + 1}</div>,
      enableSorting: false,
      meta: { labelKey: "col.board.attachFileGroupId", searchable: false },
    },
    {
      accessorKey: "title",
      header: makeSortableHeader(t, "col.board.title", "제목"),
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
      enableSorting: true,
      meta: { labelKey: "col.board.title", searchable: true },
    },
    {
      accessorKey: "attachFileGroupId",
      header: makeSortableHeader(t, "col.board.attachFileGroupId", "첨부파일"),
      cell: ({ row }) => <div>{
          row.getValue("attachFileGroupId") ? <Paperclip className="h-4 w-4 text-muted-foreground" /> : null
          }</div>,
      enableSorting: true,
      meta: { labelKey: "col.board.attachFileGroupId", searchable: true },
    },
    {
      accessorKey: "createMemberId",
      header: makeSortableHeader(t, "col.board.createMemberId", "작성자"),
      cell: ({ row }) => <div>{row.getValue("createMemberId")}</div>,
      enableSorting: true,
      meta: { labelKey: "col.board.createMemberId", searchable: true },
    },
    {
      accessorKey: "createdAt",
      header: makeSortableHeader(t, "col.board.createdAt", "작성일"),
      cell: ({ row }) => <div>{dayjs(row.getValue("createdAt")).format("YYYY-MM-DD HH:mm")}</div>,
      enableSorting: true,
      meta: { labelKey: "col.board.createdAt", searchable: false },
    },
    {
      accessorKey: "viewCount",
      header: makeSortableHeader(t, "col.board.viewCount", "조회수"),
      cell: ({ row }) => <div>{row.getValue("viewCount")}</div>,
      enableSorting: true,
      meta: { labelKey: "col.board.viewCount", searchable: false },
    }
];

const prettifyKey = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (s) => s.toUpperCase());

/**
 * 검색용 옵션 추출 (다국어 지원)
 */
export const GetSearchableBoardColumns = (
  t: TFunction,
  opts?: {
    include?: Array<keyof Board & string>;
    exclude?: Array<keyof Board & string>;
    allowAll?: boolean;
  },
) => {
    const cols = BoardColumns(t);

    const baseExcluded: Array<keyof Board & string> = opts?.allowAll
      ? []
      : (['isActive', 'createdAt'] as Array<keyof Board & string>);

    const includeSet = new Set(opts?.include ?? []);
    const excludeSet = new Set([...(opts?.exclude ?? []), ...baseExcluded]);

    const filtered = cols.filter((col): col is ColumnWithMeta => {
      const key = col.accessorKey;
      if (!key || typeof key !== 'string') return false;
      if (includeSet.size > 0 && !includeSet.has(key)) return false;
      if (excludeSet.has(key)) return false;
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
};
