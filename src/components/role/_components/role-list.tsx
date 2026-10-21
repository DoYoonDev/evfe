import { ColumnDef, Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/custom-ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import type { Role } from '@/types/admin/role.ts';

export const RoleList = ({
  table,
  columns,
  onRowClick,
}: {
  table: Table<Role>;
  columns: ColumnDef<Role>[];
  onRowClick?: (role: Role) => void;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('col.role.list', { defaultValue: '역할 목록' })}
          </CardTitle>
          <CardDescription>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {t('col.role.list.desc', {
                defaultValue:
                  '역할을 선택하면 상세 정보를 확인할 수 있습니다.\\n(상세 정보에서 수정 및 삭제가 가능합니다.)',
              }).replace(/\\n/g, "\n")}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            table={table}
            columns={columns}
            onRowClick={(row) => {
              if (onRowClick) {
                onRowClick(row);
              }
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};
