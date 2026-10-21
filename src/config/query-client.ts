import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getErrorDataByCode } from '@/lib/error';
import { DEFAULT_TEXT, STATUS_TEXTS } from '@/constants/error-view-texts';

const shouldThrowError = (error: any) => {
  if (!error?.response) return true;
  const status = error.response.status;
  return [401, 500].includes(status);
};

const handleApiError = (error: any) => {
  if (error?.config?.meta?.onErrorHandled) return;

  if (shouldThrowError(error)) throw error;
  if (!error?.response) return true;
  
  const { code, message } = getErrorDataByCode(error);
  const status = Number(code);
  const mapped = [401,403,404,500].includes(status)
    ? STATUS_TEXTS[status as 401|403|404|500]
    : DEFAULT_TEXT;

  toast.error(mapped.title, { description: message || mapped.desc });

  /*
  switch (status) {
    case 403:
      toast.error('권한이 없습니다.');
      throw error;
    case 404:
      toast.error('요청한 데이터를 찾을 수 없습니다.');
      break;
    default:
      toast.error(`요청 처리 중 오류가 발생했습니다: ${error?.message ?? 'Unknown error'}`);
  }
  */
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError: shouldThrowError,
    },
    mutations: {
      throwOnError: shouldThrowError,
    },
  },
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
});
