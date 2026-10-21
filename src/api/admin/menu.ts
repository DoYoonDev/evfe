import { defaultAxios } from '@/config/api.ts';
import type {
  Menu,
  MenuCreateRequest,
  MenuGetRequest,
  MenuUpdateRequest,
  MenuUpdatePositionRequest,
} from '@/types/common/menu.ts';
import { END_POINTS } from '@/constants/api.ts';

export const getMenus = async (
  request: MenuGetRequest,
): Promise<{ menuInfos: Menu[] }> => {
  const response = await defaultAxios.get(END_POINTS.MENU, { params: request });

  return response.data;
};

export const updateMenu = async (
  request: MenuUpdateRequest,
): Promise<{ menuInfo: Menu }> => {
  const response = await defaultAxios.put(
    `${END_POINTS.MENU}/${request.id}`,
    request,
  );
  return response.data;
};

export const updateMenuPosition = async (
  request: MenuUpdatePositionRequest,
): Promise<boolean> => {
  const response = await defaultAxios.put(
    `${END_POINTS.MENU}/position`,
    request,
  );
  return response.data;
};

export const createMenu = async (
  request: MenuCreateRequest,
): Promise<{ menuInfo: Menu }> => {
  const response = await defaultAxios.post(END_POINTS.MENU, request);
  return response.data;
};

export const deleteMenu = async (id: number): Promise<boolean> => {
  const response = await defaultAxios.delete(`${END_POINTS.MENU}/${id}`);

  return response.data;
};
