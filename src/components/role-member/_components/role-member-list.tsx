import { ColumnDef, Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { PageablePagination } from '@/components/common';
import { DataTable } from '@/components/custom-ui';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import type { RoleMember } from '@/types/admin/role.ts';

import { RoleMemberCreateDialog } from './role-member-create-dialog.tsx';

export const RoleMemberList = ({
  table,
  columns,
  selectedRole,
  keyword,
  setKeyword,
  totalElements = 0,
  isLoading = false,
}: {
  table: Table<RoleMember>;
  columns: ColumnDef<RoleMember>[];
  selectedRole: string | null;
  keyword: string;
  setKeyword: (keyword: string) => void;
  totalElements?: number;
  isLoading?: boolean
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-1">
          <CardTitle>
            {t('col.role.member.list', { defaultValue: '역할 구성원 목록' })}
          </CardTitle>
          <div className="flex justify-end items-center gap-2">
            <Input
              type="text"
              placeholder={t('placeholder.enterKeyword', { defaultValue: '검색어 입력' })}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') table.setPageIndex(0);
              }}
              className="w-60"
            />
            <RoleMemberCreateDialog selectedRole={selectedRole} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable table={table} columns={columns} />
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4">
          <PageablePagination
            page={table.getState().pagination.pageIndex}
            size={table.getState().pagination.pageSize}
            totalPages={table.getPageCount()}
            totalElements={totalElements}
            onPageChange={(page) => table.setPageIndex(page)}
            onSizeChange={(size) => table.setPageSize(size)}
            showPageSize={false} 
            isLoading={isLoading}
          />
        </CardFooter>
      </Card>
    </>
  );
};
