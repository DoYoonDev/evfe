import { useQuery } from '@tanstack/react-query';
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/components/common';
import { RoleColumns, RoleList } from '@/components/role';
import {
  RoleMenuList,
  RoleMenuProvider,
  useRoleMenuDispatch,
  useRoleMenuState,
} from '@/components/role-menu';
import { RoleMenuFetcher } from '@/components/role-menu/_components/role-menu-fetcher.tsx';
import { roleQueries } from '@/queries/role/role.ts';
import type { Role } from '@/types/admin/role.ts';

export const RoleMenuPage = () => {
  return (
    <RoleMenuProvider>
      <RoleMenuContainer />
    </RoleMenuProvider>
  );
};

const RoleMenuContainer = () => {
  const { t } = useTranslation();
  const { data, isSuccess } = useQuery(roleQueries.list());
  const dispatch = useRoleMenuDispatch();
  const { selectedRole } = useRoleMenuState();

  const handleRoleSelect = useCallback((role: Role) => {
    dispatch({ type: 'SET_SELECTED_ROLE', payload: role });
  }, [dispatch]);

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

  return (
    <>
      <PageTitle
        i18nKey="menu.role"
        defaultValue="역할별 메뉴 관리"
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
          {selectedRole && (
            <RoleMenuFetcher>
              <RoleMenuList />
            </RoleMenuFetcher>
          )}
        </div>
      </div>
    </>
  );
};

export default RoleMenuPage;