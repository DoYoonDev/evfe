import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { cn } from '@/lib/utils.ts';
import { useMenuStore } from '@/store/use-menu-store.tsx';

import { useCurrentMenu } from '../_hooks/use-current-menu.tsx';
import { LangToggle } from './lang-toggle.tsx';
import { ModeToggle } from './mode-toggle.tsx';
import { UserMenu } from './user-menu.tsx';

export const AppHeader = () => {
  const { t } = useTranslation();

  const menus = useMenuStore((state) => state.headerMenus);
  const { currentMenuTree } = useCurrentMenu();

  // 메뉴 렌더링
  const normalMenus = menus.filter(menu => menu.messageId !== "menu.user");

  return (
    <>
      <div className="flex h-full w-full items-center justify-between gap-2 px-4">
        <div />
        <div className="flex w-max items-center gap-4 pr-2">
          {normalMenus.map(menu => (
            <Link
              key={menu.id}
              to={menu.url}
              className={cn(
                'font-semibold text-gray-600 hover:text-app-primary',
                { 'text-app-primary': menu.id === currentMenuTree?.id }
              )}
            >
              {t(menu.messageId, { defaultValue: menu.name })}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <LangToggle />
          <ModeToggle />
        </div>
      </div>
    </>
  );
};
