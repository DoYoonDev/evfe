import { queryOptions } from '@tanstack/react-query';
import {
  getRoleMembers,
  getRoleMenus,
  getRoles,
  getRolesMenus,
  getMemberRoles,
  getRoleMembersPaged,
} from '@/api/admin/role.ts';
import { QUERY_KEYS } from '@/constants/query-key.ts';

import type { MemberRolesResponse, Role, RoleMember } from '@/types/admin/role.ts'; 
import { Page } from '@/types/common/page';

const asStableIds = (ids: string[]) => [...ids].sort();

const clean = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

export const roleQueries = {
  all: () => [QUERY_KEYS.ROLES],

  lists: () => [...roleQueries.all(), QUERY_KEYS.LIST],
  list: () =>
    queryOptions({
      queryKey: roleQueries.lists(),
      queryFn: () => getRoles(),
      select: (data: { roleInfos: Role[] }) => ({
        ...data,
        roleInfos: [...(data?.roleInfos ?? [])].sort(
          (a, b) => (b.level ?? 0) - (a.level ?? 0)
        ),
      }),
    }),

  roleMemberKey: (id: string | null) => [...roleQueries.all(), QUERY_KEYS.ROLE_MEMBER_LIST, id],
  roleMemberList: (id: string) =>
    queryOptions({
      queryKey: roleQueries.roleMemberKey(id),
      queryFn: () => getRoleMembers(id),
      placeholderData: (prev) => prev,
      enabled: !!id,
    }),

  roleMemberPagedKey: (
    id: string | null,
    page = 0,
    size = 10,
    keyword?: string,
    sort?: string,
  ) => [
    ...roleQueries.all(),
    QUERY_KEYS.ROLE_MEMBER_PAGED_LIST,
    id,
    clean({
      page: Math.max(0, page),
      size: Math.max(1, size),
      keyword: keyword?.trim() || undefined,
      sort: sort?.trim() || undefined,
    }),
  ],
  roleMemberPagedPrefix: (id: string) => [
    ...roleQueries.all(),
    QUERY_KEYS.ROLE_MEMBER_PAGED_LIST,
    id,
  ],
  roleMemberPagedList: (
    id: string,
    page = 0,
    size = 10,
    keyword?: string,
    sort?: string,
  ) =>
    queryOptions<{
      roleMemberInfos: Page<RoleMember>
    }>({
      queryKey: roleQueries.roleMemberPagedKey(id, page, size, keyword, sort),
      queryFn: () => getRoleMembersPaged(id, page, size, keyword?.trim(), sort),
      placeholderData: (prev) => prev,
    }),

  roleMenuKey: (id: string | null) => [...roleQueries.all(), QUERY_KEYS.ROLE_MENU_LIST, id],
  roleMenuList: (id: string) =>
    queryOptions({
      queryKey: [...roleQueries.all(), QUERY_KEYS.ROLE_MENU_LIST, { id }],
      queryFn: () => getRoleMenus(id),
      placeholderData: (prev) => prev,
      enabled: !!id,
    }),
  rolesMenuKey: (ids: string[]) => [
    ...roleQueries.all(),
    QUERY_KEYS.ROLES_MENU_LIST,
    { ids: asStableIds(ids) },
  ],
  rolesMenuList: (ids: string[]) =>
    queryOptions({
      queryKey: roleQueries.rolesMenuKey(ids),
      queryFn: () => getRolesMenus(ids),
      placeholderData: (prev) => prev,
      enabled: !!ids,
    }),

  // 특정 사용자 역할 조회
  memberRolesKeys: (memberId: string) => [
    ...roleQueries.all(),
    QUERY_KEYS.MEMBER_ROLES,
    memberId,
  ],
  memberRoles: (memberId: string) =>
    queryOptions<MemberRolesResponse, Error, string[]>({
      queryKey: roleQueries.memberRolesKeys(memberId),
      queryFn: () => getMemberRoles(memberId),
      select: (data) => {
        return Array.isArray(data) ? data : (data?.roles ?? []);
      },
      enabled: !!memberId,
    }),
};
