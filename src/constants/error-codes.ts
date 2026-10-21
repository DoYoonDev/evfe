export const ERROR_CODES = {
  // 공통
  DEFAULT:                'ERROR',

  // Axios 계층
  ERR_NETWORK:            'ERR_NETWORK',
  ECONNABORTED:           'ECONNABORTED',
  ERR_BAD_REQUEST:        'ERR_BAD_REQUEST',

  // 비즈/인증
  INVALID_ACCESS_TOKEN:   'INVALID_ACCESS_TOKEN',
  EXPIRED_ACCESS_TOKEN:   'EXPIRED_ACCESS_TOKEN',
  INVALID_REFRESH_TOKEN:  'INVALID_REFRESH_TOKEN',
  EXPIRED_REFRESH_TOKEN:  'EXPIRED_REFRESH_TOKEN',
  UNAUTHORIZED:           'UNAUTHORIZED',
  FORBIDDEN:              'FORBIDDEN',

  // HTTP 숫자 키도 문자열로 접근 가능하도록 사용처에서 Number() 처리
  '400': '400',
  '401': '401',
  '403': '403',
  '404': '404',
  '500': '500',
} as const;

export type ErrorCodeKey = keyof typeof ERROR_CODES | `${number}`;
