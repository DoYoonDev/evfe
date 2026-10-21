import { useQuery } from '@tanstack/react-query';
import { useEffect,useMemo, useRef } from 'react';

import { authQueries } from '@/queries/auth/auth';
import { roleQueries } from '@/queries/role/role';
import { useAuthStore } from '@/store/use-auth-store';
import { useMenuStore } from '@/store/use-menu-store';
import { Menu } from '@/types/common/menu';

const sameIds = (a: number[] | null, b: number[]) =>
  !!a && a.length === b.length && a.every((v, i) => v === b[i]);

export const LayoutFetcher = ({ children }: React.PropsWithChildren) => {
  // 1) auth
  const { data: authData } = useQuery(authQueries.authInfo());

  const userId   = useAuthStore((s) => s.userId);
  const roles    = useAuthStore((s) => s.roles);
  const setAuth  = useAuthStore((s) => s.setAuth);
  const setMenus = useMenuStore((s) => s.setMenus);

  // 2) auth → store 반영 
  useEffect(() => {
    if (!authData) return;
    const nextUserId = authData.userId ?? '';
    const nextRoles  = Array.isArray(authData.roles) ? authData.roles : [];
    
    const curr = Array.isArray(roles) ? [...roles].sort() : [];
    const next = [...nextRoles].sort();

    const changed =
      userId !== nextUserId ||
      curr.length !== next.length ||
      curr.some((r, i) => r !== next[i]);

    if (changed) setAuth(nextUserId, nextRoles);
  }, [authData, userId, roles, setAuth]);

  // 3) 메뉴 : roles 준비 전엔 실행하지 않음
  const stableRoles = useMemo(
    () => (Array.isArray(roles) ? [...roles].sort() : []),
    [roles]
  );
  const enabledMenus = stableRoles.length > 0 && !!userId;

  const baseOptions = roleQueries.rolesMenuList(stableRoles);
  const { data: menus, isSuccess, isFetching, error } = useQuery({
    ...baseOptions,
    enabled: enabledMenus,
    placeholderData: (prev) => prev,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    select: (resp) =>
      (resp?.roleMenuInfos ?? []).map((rm: { menu: Menu }) => rm.menu) as Menu[],
  });

  const prevIdsRef = useRef<number[] | null>(null);

  useEffect(() => {
    if (!enabledMenus) {
      prevIdsRef.current = null;
      setMenus([]);
      return;
    }

    if (error) {
      prevIdsRef.current = null;
      setMenus([]);
      return;
    }

    if (!isSuccess || isFetching || !Array.isArray(menus)) return;

    const ids = [...menus.map((m) => m.id)].sort((a, b) => a - b);
    if (sameIds(prevIdsRef.current, ids)) return;

    setMenus(menus);
    prevIdsRef.current = ids;
  }, [enabledMenus, isSuccess, isFetching, menus, error, setMenus]);

  return <>{children}</>;
};
