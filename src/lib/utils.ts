import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

/**
 * 주어진 경로 문자열을 세그먼트로 분리하여 배열로 반환합니다.
 * 각 세그먼트는 `/`로 시작합니다.
 * 예) '/system/code/' -> ['/system', '/code']
 */
export const extractSegments = (path: string): string[] => {
  const clean = (path || '').replace(/\/+$/, '');      // 끝 슬래시 제거
  const body = clean.replace(/^\/+/, '');              // 앞 슬래시 제거
  if (!body) return ['/'];                             // 루트
  return body.split('/').filter(Boolean).map((seg) => `/${seg}`);
};
