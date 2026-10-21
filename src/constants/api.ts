export const BASE_API_URL = '/api';

export const END_POINTS = {
  LOGIN: '/auth/login',
  AUTH_INFO: '/auth/info',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  MEMBER: '/members',
  CODE: '/codes',
  CODE_GROUP: '/codes/code-group',
  MENU: '/menus',
  MESSAGE: '/messages',
  ROLE: '/roles',
  LOG: '/logs',
  ACCESS: '/accesss',
  BOARD: '/boards',
  TERMS: '/terms',
} as const;
