import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteMemberFromRole } from '@/api/admin/role.ts';
import { PageTitle } from '@/components/common';
import { RoleColumns, RoleList } from '@/components/role';
import {
  RoleMemberColumns,
  RoleMemberList,
  RoleMemberProvider,
  useRoleMemberDispatch,
  useRoleMemberState,
} from '@/components/role-member';
import { roleQueries } from '@/queries/role/role.ts';
import type { Role } from '@/types/admin/role.ts';

export const RoleMemberPage = () => {
  return (
    <RoleMemberProvider>
      <RoleMemberContainer />
    </RoleMemberProvider>
  );
};

const RoleMemberContainer = () => {
  const { t } = useTranslation();
  const dispatch = useRoleMemberDispatch();
  const { selectedRole } = useRoleMemberState();
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [selectedRole?.id, keyword]);

  const { data: roleData, isSuccess } = useQuery(roleQueries.list());
  const { data: roleMemberInfos, isLoading, isFetching } = useQuery({
    ...roleQueries.roleMemberPagedList(
      selectedRole?.id ?? '',
      pagination.pageIndex,
      pagination.pageSize,
      keyword.trim()
    ),
    select: (resp) => resp.roleMemberInfos,
    placeholderData: (prev) => prev,
    enabled: !!selectedRole?.id,
  });

  const roleInfos = useMemo(() => roleData?.roleInfos ?? [], [roleData?.roleInfos]);
  const roleMember = roleMemberInfos?.content ?? [];
  const totalPages = roleMemberInfos?.totalPages ?? 0;
  const totalElements = roleMemberInfos?.totalElements ?? 0;

  const handleRoleSelect = useCallback((role: Role) => {
    dispatch({ type: 'SET_SELECTED_ROLE', payload: role });
  }, [dispatch]);

  const deleteMutation = useMutation({
    mutationFn: deleteMemberFromRole,
  });

  const handleDelete = useCallback(async (memberId: string) => {
    if (!selectedRole || !memberId) return;

    deleteMutation.mutate(
      { id: selectedRole.id, memberId },
      {
        onSuccess: async () => {
           await queryClient.invalidateQueries({
            queryKey: roleQueries.roleMemberPagedKey(
              selectedRole.id,
              pagination.pageIndex,
              pagination.pageSize,
              keyword
            ),
            exact: true,
          });
          toast.success(t('msg.common.delete.success', {defaultValue: '삭제가 완료되었습니다.'}));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.delete.fail', {defaultValue: '삭제에 실패했습니다.'}));
        },
      },
    );
  }, [deleteMutation, queryClient, selectedRole, t, pagination.pageIndex, pagination.pageSize, keyword]);

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

  const mergedRoleColumns = useMemo<ColumnDef<Role, unknown>[]>(() => {
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
    columns: mergedRoleColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const setPaginationSafe: OnChangeFn<PaginationState> = (updater) => {
    setPagination((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;

      const sizeChanged = next.pageSize !== prev.pageSize;
      let nextIndex = sizeChanged ? 0 : next.pageIndex;

      if (typeof totalPages === 'number' && totalPages >= 0) {
        nextIndex = Math.min(Math.max(0, nextIndex), Math.max(0, totalPages - 1));
      }
      return { pageIndex: nextIndex, pageSize: next.pageSize };
    });
  };

  const memberColumns = useMemo(
    () => RoleMemberColumns(t, handleDelete),
    [t, handleDelete],
  );

  const memberTable = useReactTable({
    data: roleMember,
    columns: memberColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: useMemo(() => ({ pagination }), [pagination]),
    onPaginationChange: setPaginationSafe,
  });

  useEffect(() => {
    if (!isSuccess || roleInfos.length === 0) return;

    const exists = selectedRole
      ? roleInfos.some(r => r.id === selectedRole.id)
      : false;

    if (!selectedRole || !exists) {
      dispatch({ type: 'SET_SELECTED_ROLE', payload: roleInfos[0] });
    }
  }, [isSuccess, roleInfos, selectedRole, dispatch]);

  return (
    <>
      <PageTitle
        i18nKey="menu.role.user"
        defaultValue="역할별 사용자 관리"
      />
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="h-auto">
          <RoleList
            table={roleTable}
            columns={mergedRoleColumns}
            onRowClick={handleRoleSelect}
          />
        </div>
        <div className="h-auto">
          <RoleMemberList
            table={memberTable}
            columns={memberColumns}
            selectedRole={selectedRole?.id ?? null}
            keyword={keyword}
            setKeyword={setKeyword}
            totalElements={totalElements ?? 0}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>
    </>
  );
};

export default RoleMemberPage;