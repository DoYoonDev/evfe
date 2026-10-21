import { create } from 'zustand';

import { Menu } from '@/types/common/menu.ts';

interface State {
  menus: Menu[];
  headerMenus: Menu[];
  allowedUrlSet: Set<string>;
  allowedUrlList: string[];
  hasPathAccess: (path: string) => boolean;
}

interface Action {
  setMenus: (menus: Menu[]) => void;
}

const normalize = (u: string) => {
  if (!u) return '/';
  let x = u.startsWith('/') ? u : `/${u}`;
  if (x.length > 1 && x.endsWith('/')) x = x.slice(0, -1);
  return x;
};

export const useMenuStore = create<State & Action>((set, get) => ({
  menus: [],
  headerMenus: [],
  allowedUrlSet: new Set<string>(),
  allowedUrlList: [],

  hasPathAccess: (path: string) => {
    const p = normalize(path);
    const { allowedUrlSet, allowedUrlList } = get();
    let activeSet = allowedUrlSet;

    if (!(activeSet instanceof Set) || activeSet.size === 0) {
      activeSet = new Set(allowedUrlList);
      set({ allowedUrlSet: activeSet });
    }

    for (const base of allowedUrlSet) {
      if (p === base || p.startsWith(base + '/')) return true;
    }
    return false;
  },

  setMenus: (menus) => {
    const ms = menus.map((m) => ({ ...m, url: normalize(m.url) }));

    const childrenMap = new Map<number | null, Menu[]>();
    for (const m of ms) {
      const key: number | null = m.parentMenuId ?? null;
      const arr = childrenMap.get(key) ?? [];
      arr.push(m);
      childrenMap.set(key, arr);
    }

    const firstChildDeepUrl = (root: Menu): string => {
      let current: Menu = root;
      while (true) {
        const children: Menu[] = childrenMap.get(current.id) ?? [];
        if (children.length === 0) break;
        current = children[0];
      }
      return current.url || root.url;
    };

    const headerMenus = ms
      .filter((m) => m.level === 1)
      .map((m) => ({ ...m, url: firstChildDeepUrl(m) }));

    const allowedUrlList = ms
      .map((m) => m.url)
      .filter((u): u is string => !!u);

    set({
      menus: ms,
      headerMenus,
      allowedUrlList,
      allowedUrlSet: new Set(allowedUrlList),
    });
  },
}));
