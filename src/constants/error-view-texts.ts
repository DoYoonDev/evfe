import type { ErrorCodeUnion } from '../lib/error/error-types';

export const STATUS_TEXTS: Record<ErrorCodeUnion, {
  titleKey: string; title: string;
  descKey:  string; desc:  string;
}> = {
  401: {
    titleKey: 'msg.unauthorized.title',
    title:    '로그인이 필요합니다.',
    descKey:  'msg.unauthorized.desc',
    desc:     '이 페이지를 이용하려면 먼저 로그인해주세요.',
  },
  403: {
    titleKey: 'msg.forbidden.title',
    title:    '접근이 제한된 페이지입니다.',
    descKey:  'msg.forbidden.desc',
    desc:     '접근 권한이 없습니다. 필요한 권한이 있는 계정으로 다시 로그인해주세요.',
  },
  404: {
    titleKey: 'msg.notFound.title',
    title:    '페이지를 찾을 수 없습니다.',
    descKey:  'msg.notFound.desc',
    desc:     '요청하신 페이지가 존재하지 않거나 주소가 잘못되었습니다.',
  },
  500: {
    titleKey: 'msg.serverError.title',
    title:    '서버 오류가 발생했습니다.',
    descKey:  'msg.serverError.desc',
    desc:     '일시적인 문제로 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.',
  },
};

export const DEFAULT_TEXT = {
  titleKey: 'msg.error.title',
  title:    '요청을 처리할 수 없습니다.',
  descKey:  'msg.error.desc',
  desc:     '잠시 후 다시 시도해주세요.',
};
