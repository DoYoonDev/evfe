import qs from 'qs';

import { defaultAxios } from '@/config/api.ts';
import type {
  MemberRolesResponse,
  Role,
  RoleCreateRequest,
  RoleMember,
  RoleMenu,
  RoleUpdateRequest,
} from '@/types/admin/role.ts';
import { END_POINTS } from '@/constants/api.ts';
import { Page } from '@/types/common/page';

export const getRoles = async (): Promise<{ roleInfos: Role[] }> => {
  const response = await defaultAxios.get(END_POINTS.ROLE);
  return response.data;
};

export const getRoleMembers = async (
  id: string,
): Promise<{ roleMemberInfos: RoleMember[] }> => {
  const response = await defaultAxios.get(`${END_POINTS.ROLE}/${id}/members`);
  return response.data;
};

export const getRoleMembersPaged = async (
  id: string,
  page = 0,
  size = 10,
  keyword?: string,
  sort? : string,
): Promise<{ roleMemberInfos: Page<RoleMember>}> => {
  const response = await defaultAxios.get(
    `${END_POINTS.ROLE}/${id}/members/paged`,
    { params: { page, size, keyword, sort } },
  );
  return response.data;
};

export const getRoleMenus = async (
  id: string,
): Promise<{ roleMenuInfos: RoleMenu[] }> => {
  const response = await defaultAxios.get(`${END_POINTS.ROLE}/${id}/menus`);
  return response.data;
};

export const getRolesMenus = async (
  ids: string[],
): Promise<{ roleMenuInfos: RoleMenu[] }> => {
  const response = await defaultAxios.get(`${END_POINTS.ROLE}/menus`, {
    params: { ids },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  return response.data;
};

export const updateRole = async (
  request: RoleUpdateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.put(
    `${END_POINTS.ROLE}/${request.id}`,
    request,
  );
  return response.data;
};

export const deleteRole = async (id: string): Promise<boolean> => {
  const response = await defaultAxios.delete(`${END_POINTS.ROLE}/${id}`);
  return response.data;
};

export const createRole = async (
  request: RoleCreateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.post(END_POINTS.ROLE, request);
  return response.data;
};

export const addMemberToRole = async ({
  id,
  memberId,
}: {
  id: string;
  memberId: string;
}): Promise<boolean> => {
  const response = await defaultAxios.post(
    `${END_POINTS.ROLE}/${id}/members/${memberId}`,
  );
  return response.data;
};

export const deleteMemberFromRole = async ({
  id,
  memberId,
}: {
  id: string;
  memberId: string;
}): Promise<boolean> => {
  const response = await defaultAxios.delete(
    `${END_POINTS.ROLE}/${id}/members/${memberId}`,
  );
  return response.data;
};

export const updateRoleMenus = async ({
  id,
  menuIds,
}: {
  id: string;
  menuIds: number[];
}): Promise<boolean> => {
  const response = await defaultAxios.put(`${END_POINTS.ROLE}/${id}/menus`, {
    menuIds,
  });
  return response.data;
};

export const getMemberRoles = async (
  memberId: string
): Promise<MemberRolesResponse> => {
  const response = await defaultAxios.get(
    `${END_POINTS.ROLE}/${memberId}/roles`
  );
  return response.data;
};
