import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshToken } from '@/api/auth.ts';
import { useAuthStore } from '@/store/use-auth-store.tsx';
import { defaultAxios } from './api';
import { END_POINTS } from '@/constants/api.ts';

import { getErrorDataByCode } from '@/lib/error';
import { HTTP_STATUS } from '@/constants/http-status';
import { ERROR_CODES } from '@/constants/error-codes';

const NO_AUTH_SUBSTR = [
  END_POINTS.TERMS + '/getTop',
  END_POINTS.TERMS + '/getTos',
  END_POINTS.LOGIN,
  END_POINTS.MEMBER + '/chkId/',
  END_POINTS.MEMBER + '/create',
];

let refreshPromise: Promise<{ accessToken: string }> | null = null;

type RetriableConfig = InternalAxiosRequestConfig & {
  __retry?: boolean;
  __redirected?: boolean;
};

export const handleAPIError = (
  error: AxiosError<{ code: number; message: string }>,
) => {
  if (!error.response) return Promise.reject(error);
  const { message } = getErrorDataByCode(error);
  return Promise.reject(new Error(message));
};

export const checkAndSetToken = (config: InternalAxiosRequestConfig) => {
  const { url } = config;

  if (url && NO_AUTH_SUBSTR.some((p) => url.includes(p))) {
    config.headers && Reflect.deleteProperty(config.headers, 'Authorization');
    return config;
  }

  config.headers = config.headers ?? {};
  const token = useAuthStore.getState().accessToken;

  if (!token) {
    Reflect.deleteProperty(config.headers, 'Authorization');
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const handleTokenError = async (
  error: AxiosError<{ code: number; message: string }>,
) => {
  const originalRequest = error.config as RetriableConfig | undefined;
  if (!error.response || !originalRequest) {
    return Promise.reject(error);
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[handleTokenError]', {
      status: error.response.status,
      data: error.response.data,
      url: originalRequest.url,
    });
  }

  const { code, message, requireLogin } = getErrorDataByCode(error);

  // 무한 루프 방지: 재시도 한 번만
  if (originalRequest.__retry) {
    return Promise.reject(new Error(message));
  }

  const url: string = originalRequest?.url || '';
  if (url.includes('/api/auth/refresh-token')) {
    return Promise.reject(error);
  }

  if (error.response.status === HTTP_STATUS.FORBIDDEN || code === ERROR_CODES.FORBIDDEN) {
    return Promise.reject(error);
  }

  // ① 액세스 토큰 만료: 리프레시 시도
   if (requireLogin && (code === ERROR_CODES.INVALID_ACCESS_TOKEN || code === ERROR_CODES.EXPIRED_ACCESS_TOKEN)) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          // 이벤트 루프 turn 이후 해제하여 동시 요청 큐잉 허용
          setTimeout(() => (refreshPromise = null), 0);
        });
      }
      const { accessToken } = await refreshPromise;

      // refresh API가 200인데 토큰이 없으면 비정상 → 401 페이지
      if (!accessToken) {
        return Promise.reject(error);
      }

      // 상태 업데이트 및 원요청 재시도
      const { setAccessToken } = useAuthStore.getState();
      setAccessToken(accessToken);

      defaultAxios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      originalRequest.__retry = true;

      return defaultAxios(originalRequest);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  if (
    requireLogin &&
    (
      code === ERROR_CODES.INVALID_REFRESH_TOKEN ||
      code === ERROR_CODES.EXPIRED_REFRESH_TOKEN ||
      error.response.status === HTTP_STATUS.UNAUTHORIZED
    )
  ) {
    return Promise.reject(error);
  }

  if (requireLogin) {
    return Promise.reject(error);
  }

  return Promise.reject(new Error(message));
};
