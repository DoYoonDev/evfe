import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';

import { LoadingErrorFallback } from '@/components/common/index.ts';
import { menuQueries } from '@/queries/menu/menu.ts';
import { Menu } from '@/types/common/menu.ts';

import { useMenuDispatch, useMenuState } from '../_hooks/use-menu.tsx';

export const MenuFetcher = ({ children }: React.PropsWithChildren) => {
  const { menus } = useMenuState();
  const menuDispatch = useMenuDispatch();

  const { data, isLoading, isError } = useQuery(menuQueries.list());

  const fetchedMenus: Menu[] = useMemo(() => data?.menuInfos ?? [], [data]);

  useEffect(() => {
    if (!data?.menuInfos) return;

    menuDispatch({
      type: 'SET_MENUS',
      payload: data?.menuInfos ?? [],
    });
  }, [menuDispatch, data]);

  if (isLoading) return <LoadingErrorFallback status="loading" />;
  if (isError) return <LoadingErrorFallback status="error" />;
  if (menus.length !== fetchedMenus.length) return <LoadingErrorFallback status="loading" />;

  return <>{children}</>;
};
