import { defaultAxios } from '@/config/api.ts';

import type {
  CodeUpdateRequest,
  Code,
  CodeCreateRequest,
  CodeGroup,
  CodeGroupCreateRequest,
  CodeGroupUpdateRequest,
  CodeSearch,
  CodeGroupSearch,
  CodePage,
  CodeGroupPage,
} from '@/types/admin/code.ts';
import { END_POINTS } from '@/constants/api.ts';

export const getCode = async (id: string): Promise<Code> => {
  const response = await defaultAxios.get(`${END_POINTS.CODE}/${id}`);

  return response.data.codeInfo;
};

export const getCodes = async (
  id: string,
  filter: CodeSearch,
): Promise<CodePage> => {
  const response = await defaultAxios.get(
    `${END_POINTS.CODE_GROUP}/${id}/codes`,
    {
      params: filter,
    },
  );

  return response.data;
};

export const getCodeGroup = async (id: string): Promise<CodeGroup> => {
  const response = await defaultAxios.get(`${END_POINTS.CODE_GROUP}/${id}`);

  return response.data.codeInfo;
};

export const getCodeGroups = async (
  filter: CodeGroupSearch,
): Promise<CodeGroupPage> => {
  const response = await defaultAxios.get(END_POINTS.CODE_GROUP, {
    params: filter,
  });

  return response.data;
};

export const createCode = async (
  request: CodeCreateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.post(END_POINTS.CODE, request);

  return response.data;
};

export const createCodeGroup = async (
  request: CodeGroupCreateRequest,
): Promise<boolean> => {
  const response = await defaultAxios.post(END_POINTS.CODE_GROUP, request);

  return response.data;
};

export const updateCode = async ({
  id,
  groupId,
  name,
  description,
  sortOrder,
  isActive,
}: CodeUpdateRequest): Promise<boolean> => {
  const response = await defaultAxios.put(`${END_POINTS.CODE}/${id}`, {
    groupId,
    name,
    description,
    sortOrder,
    isActive,
  });

  return response.data;
};

export const updateCodeGroup = async ({
  id,
  name,
  description,
  isActive,
}: CodeGroupUpdateRequest): Promise<boolean> => {
  const response = await defaultAxios.put(`${END_POINTS.CODE_GROUP}/${id}`, {
    name,
    description,
    isActive,
  });

  return response.data;
};

export const deleteCode = async (id: string): Promise<boolean> => {
  const response = await defaultAxios.delete(`${END_POINTS.CODE}/${id}`);

  return response.data;
};

export const deleteCodeGroup = async (id: string): Promise<boolean> => {
  const response = await defaultAxios.delete(`${END_POINTS.CODE_GROUP}/${id}`);

  return response.data;
};