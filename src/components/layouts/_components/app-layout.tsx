import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router';

import { LayoutFetcher } from '@/components/layouts/_components/layout-fetcher.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx';

import { AppHeader } from './app-header.tsx';
import { AppSidebar } from './app-sidebar.tsx';
import { Breadcrumb } from './breadcrumb.tsx';

const SAFE_PATH_KEY = 'lastSafePath';

export const AppLayout = () => {
  const location = useLocation();

  const isErrorLike = useMemo(() => {
    const p = location.pathname;
    return (
      p.startsWith('/login') ||
      p.startsWith('/signup') ||
      p.startsWith('/404') ||
      p.startsWith('/403') ||
      p.startsWith('/500') ||
      p.startsWith('/error')
    );
  }, [location.pathname]);

  useEffect(() => {
    if (isErrorLike) return;
    const current = location.pathname + (location.search || '');
    if (sessionStorage.getItem(SAFE_PATH_KEY) !== current) {
      sessionStorage.setItem(SAFE_PATH_KEY, current);
    }
  }, [isErrorLike, location.pathname, location.search]);

  return (
    <LayoutFetcher>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header
            role="banner"
            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-3"
          >
            <AppHeader />
          </header>
          <main role="main" className="flex min-h-[calc(100svh-4rem)] flex-col">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </LayoutFetcher>
  );
};

export const DefaultLayout = ({
  isShowBreadcrumb = true,
}: {
  isShowBreadcrumb?: boolean;
}) => {
  return (
    <>
      <div className="flex h-12 md:h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {isShowBreadcrumb && <Breadcrumb />}
        </div>
      </div>

      {/* Contents */}
      <main className="flex-1 p-4 pt-3">
        <Outlet />
      </main>
    </>
  );
};
