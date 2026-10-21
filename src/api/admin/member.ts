import { defaultAxios } from '@/config/api.ts';
import type { Member, MemberCreateRequest, MemberListFilter } from '@/types/admin/member';
import type { Page } from '@/types/common/page.ts';
import { END_POINTS } from '@/constants/api.ts';
import { InfoEditSchemaValues } from '@/schemas/common/info';
import { PasswordEditSchemaValue } from '@/schemas/common/password';

export const getMembers = async (): Promise<{ memberInfos: Member[], totalCount: number }> => {
  const response = await defaultAxios.get(END_POINTS.MEMBER);
  return response.data;
};

export const getMembersPage = async (filter: MemberListFilter): Promise<{
  memberInfos: Page<Member>;
}> => {
  const response = await defaultAxios.get(`${END_POINTS.MEMBER}/page`, { params: filter });
  return response.data;
};

export const getMemberDetail = async (id: string): Promise<Member> => {
  const response = await defaultAxios.get(`${END_POINTS.MEMBER}/${id}`);
  return response.data;
};

export const updateMember = async (member: InfoEditSchemaValues): Promise<void> => {
  await defaultAxios.put(`${END_POINTS.MEMBER}/${member.id}`, member);
};

export const deleteMember = async (id: string): Promise<void> => {
  await defaultAxios.delete(`${END_POINTS.MEMBER}/${id}`);
};

export const createMember = async (
  request: MemberCreateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.post(`${END_POINTS.MEMBER}/create`, request);

  return response.data;
};

export const checkDuplicateUserId = async (
  userId: string,
): Promise<boolean> => {
  const response = await defaultAxios.get(`${END_POINTS.MEMBER}/chkId/${userId}`);

  return response.data;
};

export const updatePassword = async (data: PasswordEditSchemaValue) => {
  await defaultAxios.put(`${END_POINTS.MEMBER}/updatePw/${data.id}`, data);
}

export const resetMemberPassword = async (memberId: string): Promise<void> => {
  await defaultAxios.post(`${END_POINTS.MEMBER}/${memberId}/password/reset`);
};