import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef } from 'react';

import { LoadingErrorFallback } from '@/components/common';
import { useRoleMenuDispatch, useRoleMenuState } from '@/components/role-menu';
import { roleQueries } from '@/queries/role/role.ts';
import { RoleMenu } from '@/types/admin/role';

const buildSignature = (list: RoleMenu[]) =>
  list
    .map((it) => `${it.menu.id}:${it.isChecked ? 1 : 0}`)
    .sort()
    .join('|');

export const RoleMenuFetcher = ({ children }: React.PropsWithChildren) => {
  const { selectedRole } = useRoleMenuState();
  const roleMenuDispatch = useRoleMenuDispatch();

  const roleId = selectedRole?.id ?? '';
  const canFetch = !!roleId;
  
  const base = roleQueries.roleMenuList(roleId);
  const { data: roleMenus = [], isLoading, isError, isSuccess } = useQuery({
    ...base,
    enabled: canFetch,
    select: (resp) => (resp?.roleMenuInfos ?? []) as RoleMenu[],
  });

  const signature = useMemo(() => buildSignature(roleMenus), [roleMenus]);
  const prevSigRef = useRef<string>('');

  useEffect(() => {
    if (!canFetch) {
      prevSigRef.current = '';
      roleMenuDispatch({ type: 'SET_ROLE_MENUS', payload: [] });
    }
  }, [canFetch, roleMenuDispatch]);

  useEffect(() => {
    if (!isSuccess || !canFetch) return;
    if (prevSigRef.current !== signature) {
      prevSigRef.current = signature;
      roleMenuDispatch({ type: 'SET_ROLE_MENUS', payload: roleMenus });
    }
  }, [isSuccess, canFetch, signature, roleMenus, roleMenuDispatch]);

  if (!canFetch) return <LoadingErrorFallback status="loading" />;
  if (isLoading) return <LoadingErrorFallback status="loading" />;
  if (isError) return <LoadingErrorFallback status="error" />;

  return <>{children}</>;
};