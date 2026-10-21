import { AxiosHeaders, AxiosRequestHeaders } from 'axios';
import { create } from 'zustand';

import { logoutServer } from '@/api/auth';
import { defaultAxios } from '@/config/api';
import { ACCESS_TOKEN_KEY } from '@/constants/common';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

const safeGet = (k: string) => {
  if (!isBrowser) return null;
  try { return localStorage.getItem(k); } catch { return null; }
};
// eslint-disable-next-line no-empty
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
// eslint-disable-next-line no-empty
const safeRemove = (k: string) => { try { localStorage.removeItem(k); } catch {} };

const authChannel = isBrowser && 'BroadcastChannel' in window ? new BroadcastChannel('auth') : null;

if (isBrowser) {
  window.addEventListener('storage', (e) => {
    if (e.key === ACCESS_TOKEN_KEY) {
      const headers = defaultAxios.defaults.headers.common as AxiosHeaders;
      if (e.newValue == null) {
        headers.delete?.('Authorization');
      } else {
        headers.set?.('Authorization', `Bearer ${e.newValue}`);
      }
    }
  });
}

const bootToken = safeGet(ACCESS_TOKEN_KEY);
if (bootToken) {
  defaultAxios.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
}

type LogoutOptions = { server?: boolean; signal?: AbortSignal };

interface AuthState {
  userId: string | null;
  roles: string[] | null;
  accessToken: string | null;
  isLoggingOut: boolean;
}

interface Action {
  setAccessToken: (accessToken: string | null) => void;
  setAuth: (userId: string, roles: string[]) => void;
  logout: (opts?: LogoutOptions) => Promise<void>;
}

export const useAuthStore = create<AuthState & Action>((set, get) => {
  const clearClient = () => {
    safeRemove(ACCESS_TOKEN_KEY);
    const headers = defaultAxios.defaults.headers.common as AxiosRequestHeaders;
    delete headers.Authorization;
    set({
      userId: null,
      roles: null,
      accessToken: null,
      isLoggingOut: false,
    });
  };

  if (authChannel) {
    authChannel.onmessage = (e) => {
      const t = e.data?.type;
      if (t === 'LOGOUT') clearClient();
      if (t === 'LOGIN' && typeof e.data?.token === 'string') {
        // 다른 탭에서 로그인 → 현재 탭도 즉시 반영
        defaultAxios.defaults.headers.common.Authorization = `Bearer ${e.data.token}`;
        set({ accessToken: e.data.token });
        safeSet(ACCESS_TOKEN_KEY, e.data.token);
      }
    };
  }

  return {
    userId: null,
    roles: null,
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    isLoggingOut: false,

    setAccessToken: (accessToken) => {
      if (!accessToken) {
        clearClient();
        authChannel?.postMessage({ type: 'LOGOUT' });
        return;
      }
      safeSet(ACCESS_TOKEN_KEY, accessToken);
      defaultAxios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      set({ accessToken });
      authChannel?.postMessage({ type: 'LOGIN', token: accessToken });
    },

    setAuth: (userId, roles) => {
      set({ userId, roles });
    },

    logout: async (opts) => {
      if (get().isLoggingOut) return;
      set({ isLoggingOut: true });

      try {
        if (opts?.signal?.aborted) return;
        if (opts?.server !== false) {
          try {
            await logoutServer(opts?.signal);
          } catch {
            // 서버 실패여도 클라이언트 정리는 진행
          }
        }
      } finally {
        clearClient();
        authChannel?.postMessage({ type: 'LOGOUT' });
      }
    },
  };
});
