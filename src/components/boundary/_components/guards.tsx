import { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { LoadingView } from '@/components/common';
import { useAuthStore } from '@/store/use-auth-store';
import { useMenuStore } from '@/store/use-menu-store';

function hasAnyRole(userRoles: string[] | null | undefined, required: string[] = []) {
  if (!required.length) return true;
  if (!userRoles?.length) return false;
  const set = new Set(userRoles);
  return required.some(r => set.has(r));
}

/** 로그인 여부 확인 */
export const RequireAuth = ({ children }: PropsWithChildren) => {
  const accessToken = useAuthStore(s => s.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ? <>{children}</> : <Outlet />;
};

/** 역할 확인  */
export const RequireRoles = (
  { anyOf, children }: PropsWithChildren<{ anyOf: string[] }>
) => {
  const roles = useAuthStore(s => s.roles);
  const accessToken = useAuthStore(s => s.accessToken);

  if (accessToken && roles === null) {
    return <LoadingView />;
  }

  if (!hasAnyRole(roles, anyOf)) {
    return <Navigate to="/error/403" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

/** 메뉴 기반 접근 확인 */
export const RequireMenuAccess = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();

  const accessToken = useAuthStore(s => s.accessToken);
  const roles = useAuthStore(s => s.roles);
  const hasPathAccess = useMenuStore(s => s.hasPathAccess);

  const allowedCount  = useMenuStore(s => s.allowedUrlList.length);

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  if (roles === null || allowedCount === 0) {
    return <LoadingView />;
  }

  if (!hasPathAccess(pathname)) {
    return <Navigate to="/error/403" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};