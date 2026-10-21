import { useQuery } from '@tanstack/react-query';
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/components/common';
import {
  RoleColumns,
  RoleProvider,
  useRoleDispatch,
  useRoleState,
} from '@/components/role';
import { RoleForm, RoleList } from '@/components/role';
import { roleQueries } from '@/queries/role/role.ts';
import type { Role } from '@/types/admin/role.ts';

export const RolePage = () => {
  return (
    <RoleProvider>
      <RoleContainer />
    </RoleProvider>
  );
};

const RoleContainer = () => {
  const { t } = useTranslation();
  const { data, isSuccess } = useQuery(roleQueries.list());
  const dispatch = useRoleDispatch();
  const { selectedRole } = useRoleState();

  const roleInfos = useMemo(() => data?.roleInfos || [], [data]);

  useEffect(() => {
    if (!isSuccess || roleInfos.length === 0) return;

    const exists = selectedRole
      ? roleInfos.some(r => r.id === selectedRole.id)
      : false;

    if (!selectedRole || !exists) {
      dispatch({ type: 'SET_SELECTED_ROLE', payload: roleInfos[0] });
    }
  }, [isSuccess, roleInfos, selectedRole, dispatch]);

  const defaultColumn = useMemo(
    () => ({
      meta: {
        getCellContext: (context: CellContext<Role, unknown>) => {
          const { row } = context;
          const highlight = row.original.id === selectedRole?.id;
          return {
            className: highlight
              ? 'bg-blue-100 dark:bg-blue-900/40 transition-colors'
              : '',
          };
        },
      },
    }),
    [selectedRole],
  );

  const columns = useMemo<ColumnDef<Role, unknown>[]>(() => {
    const base = RoleColumns(t);
    return base.map(col => ({
      ...col,
      meta: {
        ...(defaultColumn.meta ?? {}),
        ...(col.meta ?? {}),
      },
    }));
  }, [t, defaultColumn]);

  const roleTable = useReactTable({
    data: roleInfos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRoleSelect = (role: Role) => {
    dispatch({ type: 'SET_SELECTED_ROLE', payload: role });
  };

  return (
    <>
      <PageTitle
        i18nKey="menu.role"
        defaultValue="역할 관리"
      />
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="h-auto">
          <RoleList
            table={roleTable}
            columns={columns}
            onRowClick={handleRoleSelect}
          />
        </div>
        <div className="h-auto">
          <RoleForm />
        </div>
      </div>
    </>
  );
};

export default RolePage;