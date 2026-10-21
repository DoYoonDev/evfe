import type { AxiosError } from 'axios';

export type ErrorDatum = {
  code: string;             // 표준화된 내부 코드 문자열
  message: string;          // 기본 표시 메시지(줄바꿈 \n 허용)
  requireLogin?: boolean;   // 로그인 필요 여부
};

export type ErrorCodeUnion = 401 | 403 | 404 | 500;

export type ServerErrorBody = { code?: string | number; message?: string };

export type AxiosErr = AxiosError<ServerErrorBody>;
