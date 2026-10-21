import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';

import { extractSegments } from '@/lib/utils.ts';
import { useMenuStore } from '@/store/use-menu-store.tsx';
import type { Menu, MenuWithChildren } from '@/types/common/menu.ts';

const generateTreeStructure = (menus: Menu[]): MenuWithChildren[] => {
  const menuMap: Record<string, MenuWithChildren> = {};
  const roots: MenuWithChildren[] = [];

  menus.forEach((menu) => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  menus.forEach((menu) => {
    if (menu.parentMenuId) {
      const parent = menuMap[menu.parentMenuId];
      if (!parent) return;

      parent.children!.push(menuMap[menu.id]);
    } else {
      roots.push(menuMap[menu.id]);
    }
  });

  return roots;
};

const findMenuByPathnameInTree = (
  tree: MenuWithChildren[],
  pathname: string,
): MenuWithChildren | null => {
  for (const item of tree) {
    if (item.url === pathname) {
      return item;
    }
    if (item.children.length > 0) {
      const found = findMenuByPathnameInTree(item.children, pathname);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const norm = (p: string) => p.replace(/\/+$/, '') || '/';

export const useCurrentMenu = () => {
  const { pathname: rawPath } = useLocation();
  const { id } = useParams<{ id: string }>();

  const pathname = useMemo(() => {
    const p = norm(rawPath);
    const parts = p.split('/').filter(Boolean);
    if (parts.length === 0) return '/';
    const last = parts[parts.length - 1];

    if ((id && last === id) || last === 'new') {
      parts.pop();
    }
    return '/' + parts.join('/');
  }, [rawPath, id]);

  const menus = useMenuStore((state) => state.menus);
  const [currentMenuTree, setCurrentMenuTree] = useState<MenuWithChildren | null>(null);

  const menuTree = useMemo(() => generateTreeStructure(menus), [menus]);

  const currentMenu = useMemo(() => {
    let p = pathname;
    while (true) {
      const found = findMenuByPathnameInTree(menuTree, p);
      if (found) return found;
      const idx = p.lastIndexOf('/');
      if (idx <= 0) return null;
      p = p.slice(0, idx);
    }
  }, [menuTree, pathname]);

  useEffect(() => {
    const segments = extractSegments(pathname);
    const top = segments[0] ?? '/';
    const _currentMenu = menuTree.find((menu) => menu.url === top) ?? null;
    setCurrentMenuTree(_currentMenu);
  }, [pathname, menuTree]);

  return {
    currentMenuTree,
    currentMenu,
  };
};
