import { isAxiosError } from 'axios';
import { ERROR_CODES } from '../../constants/error-codes';
import { HTTP_STATUS } from '../../constants/http-status';
import type { AxiosErr, ErrorDatum } from './error-types';

const DICT: Record<string, ErrorDatum> = {
  // 디폴트
  [ERROR_CODES.DEFAULT]: {
    code: ERROR_CODES.DEFAULT,
    message: '알 수 없는 오류가 발생했습니다.',
  },

  // Axios 네트워크/타임아웃
  [ERROR_CODES.ERR_NETWORK]:   {
    code: ERROR_CODES.ERR_NETWORK,
    message: '서버가 응답하지 않습니다.\n잠시 후 다시 시도하거나 관리자에게 문의하세요.',
  },
  [ERROR_CODES.ECONNABORTED]:  {
    code: ERROR_CODES.ECONNABORTED,
    message: '요청 시간이 초과되었습니다.\n네트워크 상태를 확인해주세요.',
  },
  [ERROR_CODES.ERR_BAD_REQUEST]: {
    code: ERROR_CODES.ERR_BAD_REQUEST,
    message: '잘못된 요청입니다.',
  },

  // HTTP 상태
  [String(HTTP_STATUS.BAD_REQUEST)]:       { code: '400', message: '잘못된 요청입니다.' },
  [String(HTTP_STATUS.UNAUTHORIZED)]:      { code: '401', message: '로그인 후 이용해주세요.', requireLogin: true },
  [String(HTTP_STATUS.FORBIDDEN)]:         { code: '403', message: '접근 권한이 없습니다.' },
  [String(HTTP_STATUS.NOT_FOUND)]:         { code: '404', message: '요청한 리소스를 찾을 수 없습니다.' },
  [String(HTTP_STATUS.INTERNAL_SERVER_ERROR)]: { code: '500', message: '서버 오류가 발생했습니다.' },

  // 인증/토큰
  [ERROR_CODES.INVALID_ACCESS_TOKEN]:  { code: ERROR_CODES.INVALID_ACCESS_TOKEN,  message: '토큰이 만료되었습니다.', requireLogin: true },
  [ERROR_CODES.EXPIRED_ACCESS_TOKEN]:  { code: ERROR_CODES.EXPIRED_ACCESS_TOKEN,  message: '토큰이 만료되었습니다.', requireLogin: true },
  [ERROR_CODES.INVALID_REFRESH_TOKEN]: { code: ERROR_CODES.INVALID_REFRESH_TOKEN, message: '토큰이 만료되었습니다. 다시 로그인해주세요.', requireLogin: true },
  [ERROR_CODES.EXPIRED_REFRESH_TOKEN]: { code: ERROR_CODES.EXPIRED_REFRESH_TOKEN, message: '토큰이 만료되었습니다. 다시 로그인해주세요.', requireLogin: true },
  [ERROR_CODES.UNAUTHORIZED]:          { code: ERROR_CODES.UNAUTHORIZED,          message: '로그인 후 이용해주세요.', requireLogin: true },
  [ERROR_CODES.FORBIDDEN]:             { code: ERROR_CODES.FORBIDDEN,             message: '접근 권한이 없습니다.' },
};

const pick = (key?: string | number | null): ErrorDatum | undefined => {
  if (key == null) return;
  const k = String(key).trim();
  return DICT[k];
};

const fallback = (msg?: string): ErrorDatum => ({
  ...DICT[ERROR_CODES.DEFAULT],
  message: (msg?.trim() || DICT[ERROR_CODES.DEFAULT].message),
});

export const getErrorDataByCode = (err: unknown): ErrorDatum => {
  // 1) AxiosError 우선 처리
  if (isAxiosError(err)) {
    const resp = (err as AxiosErr).response;
    const data = resp?.data as { code?: string | number; status?: number | string; message?: string } | undefined;

    // 1) 서버 code (문자/숫자 모두 허용) — e.g. "INVALID_REFRESH_TOKEN", 401
    const byDataCode = pick(data?.code);
    if (byDataCode) return byDataCode;

    // 2) 서버가 body에 넣은 status (문자/숫자 모두 허용) — e.g. 401
    const byDataStatus = pick(data?.status);
    if (byDataStatus) return byDataStatus;

    // 3) HTTP status — e.g. 401
    const byHttp = pick(resp?.status);
    if (byHttp) return byHttp;

    // 4) Axios 자체 코드 — e.g. "ECONNABORTED", "ERR_NETWORK"
    const byAxios = pick((err as any).code);
    if (byAxios) return byAxios;

    // 5) 서버 메시지(fallback)
    return fallback(data?.message ?? err.message);
  }

  if (err instanceof Error) {
    const msg = err.message?.toLowerCase() ?? '';
    if (msg.includes('network')) return DICT[ERROR_CODES.ERR_NETWORK];
    if (msg.includes('timeout')) return DICT[ERROR_CODES.ECONNABORTED];
    return fallback(err.message);
  }

  return DICT[ERROR_CODES.DEFAULT];
};

/** 숫자 상태코드 → 상태페이지 텍스트 매핑용 가드 */
export const isStatusForPage = (code: unknown): code is 401|403|404|500 => {
  const n = Number(code);
  return [401,403,404,500].includes(n);
};
