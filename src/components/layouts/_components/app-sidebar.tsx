import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar.tsx';
import { cn } from '@/lib/utils.ts';

import { useCurrentMenu } from '../_hooks/use-current-menu.tsx';

export const AppSidebar = () => {
  const { t } = useTranslation();
  const sidebar = useSidebar();

  const { currentMenuTree, currentMenu } = useCurrentMenu();

  const { pathname } = useLocation();
  const normalize = (p?: string) => (p ?? '').replace(/\/+$/, '') || '/';
  const eqByUrl = (u?: string) => normalize(u) === normalize(currentMenu?.url) || normalize(u) === normalize(pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <Button variant="ghost" className="w-full" asChild>
          <Link to="/">EVOLVE SOFT</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t(currentMenuTree?.messageId || currentMenuTree?.name || '')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenuTree?.children.map((menu) => (
                <div key={menu.id}>
                  {menu.children?.length === 0 ? (
                    <SidebarMenuItem key={menu.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => {
                          sidebar.setOpenMobile(false);
                        }}
                        className={cn(
                          'font-semibold text-gray-600 hover:text-app-primary',
                          {
                            'text-app-primary': menu.id === currentMenu?.id || eqByUrl(menu.url),
                          },
                        )}
                      >
                        <Link to={menu.url}>
                          <span>
                            {t(menu.messageId, {
                              defaultValue: menu.name,
                            })}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <Collapsible
                      key={menu.id}
                      asChild
                      defaultOpen={true}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(menu.messageId, {
                              defaultValue: menu.name,
                            })}
                          >
                            <span>
                              {t(menu.messageId, {
                                defaultValue: menu.name,
                              })}
                            </span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menu.children?.map((child) => (
                              <SidebarMenuSubItem key={child.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={cn(
                                    'font-semibold text-gray-600 hover:text-app-primary',
                                    {
                                      'text-app-primary': child.id === currentMenu?.id || eqByUrl(child.url),
                                    },
                                  )}
                                >
                                  <Link to={child.url}>
                                    <span>
                                      {t(child.messageId, {
                                        defaultValue: child.name,
                                      })}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
