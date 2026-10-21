import axios from 'axios';
import { BASE_API_URL } from '@/constants/api.ts';
import {
  checkAndSetToken,
  handleAPIError,
  handleTokenError,
} from '@/config/interceptors.ts';

export const defaultAxios = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

defaultAxios.interceptors.request.use(checkAndSetToken, (e) => Promise.reject(e));

defaultAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.config?.meta?.skipRefresh) return Promise.reject(error);
    const retry = await handleTokenError(error);
    if (retry) return retry;
    return handleAPIError(error);
  }
);