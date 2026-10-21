import { useParams } from 'react-router-dom';

import { ErrorView } from '@/components/error/_components/error-view';
import { DEFAULT_TEXT, STATUS_TEXTS } from '@/constants/error-view-texts';
import { isStatusForPage } from '@/lib/error';

export const ErrorPage = () => {
  const { code } = useParams();
  const status = Number(code);

   const mapped = isStatusForPage(status)
    ? STATUS_TEXTS[status]
    : DEFAULT_TEXT;

  return (
    <ErrorView
      titleKey={mapped.titleKey}
      titleDefault={mapped.title}
      descKey={mapped.descKey}
      descDefault={mapped.desc}
      status={isStatusForPage(status) ? status : undefined}
      requireLogin={status === 401}
    />
  );
}

export default ErrorPage;