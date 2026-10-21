import { defaultAxios } from '@/config/api.ts';
import { END_POINTS } from '@/constants/api.ts';
import { AuthResponse, TokenResponse } from '@/types/auth.ts';

export const login = async ({
  userId,
  password,
}: { userId: string; password: string; }): Promise<TokenResponse> => {
  const response = await defaultAxios.post(
    END_POINTS.LOGIN,
    { userId, password },
    { meta: { skipRefresh: true } }
  );
  return response.data;
};

export const getAuthInfo = async (): Promise<AuthResponse> => {
  const response = await defaultAxios.get(`${END_POINTS.AUTH_INFO}`);
   return response.data;
};

export const refreshToken = async (): Promise<TokenResponse> => {
  const response = await defaultAxios.post(
    END_POINTS.REFRESH_TOKEN,
    undefined,
    { meta: { skipRefresh: true } }
  );
  return response.data;
};

export const logoutServer = async (signal: AbortSignal | undefined): Promise<Boolean> => {
  try {
    await defaultAxios.post<void>(
      END_POINTS.LOGOUT,
      undefined,
      { signal, timeout: 5000, meta: { skipRefresh: true } }
    );
    return true;
  } catch {
    return false;
  }
};
