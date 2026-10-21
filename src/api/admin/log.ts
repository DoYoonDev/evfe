import { defaultAxios } from '@/config/api.ts';
import { END_POINTS } from '@/constants/api.ts';
import { LogAccess, LogAccessListFilter } from '@/types/admin/log-access';
import { LogLogin, LogLoginListFilter } from '@/types/admin/log-login';
import { Page } from '@/types/common/page';

export const getLoginLogsPage = async (filter: LogLoginListFilter): Promise<{
  logLoginInfos: Page<LogLogin>;
}> => {
  const response = await defaultAxios.get(`${END_POINTS.LOG}/logins`, { params: filter });
  return response.data;
};

export const getAccessLogsPage = async (filter: LogAccessListFilter): Promise<{
  logAccessInfos: Page<LogAccess>;
}> => {
  const response = await defaultAxios.get(`${END_POINTS.LOG}${END_POINTS.ACCESS}`, { params: filter });
  return response.data;
}