import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { useMenuStore } from '@/store/use-menu-store.tsx';
import type { Menu } from '@/types/common/menu.ts';

import { useCurrentMenu } from '../_hooks/use-current-menu.tsx';

const getBreadcrumb = (
  menus: Menu[],
  currentMenu: Menu | null,
  pathname: string,
  id: string | undefined,
) => {
  const menuMap = menus.reduce((map: Record<string, Menu>, menu) => {
    map[menu.id] = menu;
    return map;
  }, {});

  if (!currentMenu) {
    return [];
  }
  const breadcrumb = [];
  let menu = currentMenu;

  while (menu) {
    breadcrumb.unshift(menu);
    menu = menuMap[menu.parentMenuId!];
  }

  const isNew = pathname.endsWith('/new');
  if (id) {
    breadcrumb.push({
      id: 'detail',
      name: '상세',
      url: pathname,
      messageId: 'btn.detail',
    });
  } else if (isNew) {
    breadcrumb.push({
      id: 'new',
      name: '등록',
      url: pathname,
      messageId: 'btn.create',
    });
  }

  return breadcrumb;
};

export const Breadcrumb = () => {
  const { t } = useTranslation();

  const menus = useMenuStore((state) => state.menus);

  const { currentMenu } = useCurrentMenu();
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  const breadcrumb = useMemo(
    () => getBreadcrumb(menus, currentMenu, pathname, id),
    [menus, currentMenu, pathname, id],
  );

  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {breadcrumb.map((item, index) =>
          index === breadcrumb.length - 1 ? (
            <BreadcrumbItem key={item.id}>
              <BreadcrumbPage>
                {t(item.messageId, { defaultValue: item.name })}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <Fragment key={item.id}>
              <BreadcrumbItem>
                {index === 0 ? (
                  <>{t(item.messageId, { defaultValue: item.name })}</>
                ) : (
                  <BreadcrumbLink href={item.url}>
                    {t(item.messageId, { defaultValue: item.name })}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ),
        )}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
