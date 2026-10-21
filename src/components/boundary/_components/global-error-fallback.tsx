import { FallbackProps } from 'react-error-boundary';

import { ErrorView } from '@/components/error/_components/error-view';
import { DEFAULT_TEXT, STATUS_TEXTS } from '@/constants/error-view-texts';
import { getErrorDataByCode, isStatusForPage } from '@/lib/error';

type AppError = Error & { status?: number; code?: string | number };

export const GlobalErrorFallback = ({ error }: FallbackProps) => {
  const errorData = getErrorDataByCode(error);
  const appError = error as AppError;

  const status =
    typeof appError.status === 'number'
      ? appError.status
      : (typeof errorData?.code === 'number' ? Number(errorData.code) : undefined);

  const mapped = isStatusForPage(status)
    ? STATUS_TEXTS[status]
    : DEFAULT_TEXT;

  return (
    <ErrorView
      className="min-h-[100dvh]"
      titleKey={mapped.titleKey}
      titleDefault={mapped.title}
      descKey={mapped.descKey}
      descDefault={(errorData?.message ?? mapped.desc)?.replace(/\\n/g, "\n")}
      requireLogin={status === 401 || errorData?.requireLogin}
      status={Number(status)}
    />
  );
}
