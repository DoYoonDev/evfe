import { useTranslation } from 'react-i18next';

type Status = 'loading' | 'error' | 'custom';

interface Props {
  status: Status;
  messageKey?: string;     // i18n key
  defaultMessage?: string; // fallback message
  onRetry?: () => void;    // error 상태에서만 표시
}

export const LoadingErrorFallback: React.FC<Props> = ({
  status,
  messageKey,
  defaultMessage,
  onRetry,
}) => {
  const { t } = useTranslation();

  if (status === 'loading') {
    return <div>{t(messageKey ?? 'msg.common.loading', { defaultValue: defaultMessage ?? '로딩 중...' })}</div>;
  }

  if (status === 'error') {
    return (
      <div>
        {t(messageKey ?? 'msg.common.loadFail', {
          defaultValue: defaultMessage ?? '데이터를 불러오지 못했습니다.',
        })}
        {onRetry && (
          <button
            className="ml-2 text-sm text-blue-600 underline"
            onClick={onRetry}
          >
            {t('msg.common.retry', { defaultValue: '다시 시도' })}
          </button>
        )}
      </div>
    );
  }

  // custom 메시지
  if (status === 'custom') {
    return <div>{t(messageKey ?? 'message', { defaultValue: defaultMessage ?? '' })}</div>;
  }

  return null;
};
