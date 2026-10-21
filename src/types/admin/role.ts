import type { Menu } from '@/types/common/menu.ts';

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  description: string | null;
  level: number;
}

export interface RoleMember {
  memberId: string;
  koName?: string;
  enName?: string;
}

export interface RoleMenu {
  menu: Menu;
  isChecked: boolean;
}

export type RoleGetRequest = Role;

export type RoleUpdateRequest = Omit<Role, 'sortOrder' | 'level'>;

export type RoleCreateRequest = Role;

export type MemberRolesResponse = string[] | { memberId: string; roles: string[] };

export type RoleMemberParams = {
  page?: number;
  size?: number;
  keyword?: string;
};
