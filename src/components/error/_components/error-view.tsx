import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

type Props = {
  titleKey: string;
  titleDefault: string;
  descKey: string;
  descDefault: string;
  requireLogin?: boolean;
  status?: number;
  showBack?: boolean;
  showHome?: boolean;
  className?: string;
};

export const  ErrorView = ({
  titleKey,
  titleDefault,
  descKey,
  descDefault,
  requireLogin = false,
  status, 
  showBack = true,
  showHome = true,
  className = 'min-h-[60vh]',
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const needLogin = requireLogin || status === 401;

  const baseCls =
    `flex ${className} flex-col items-center justify-center text-center gap-4 
     bg-background text-foreground px-4`;

  const message = t(descKey, { defaultValue: descDefault });
  const normalized = message.replace(/\\n/g, '\n');

  return (
    <section
      className={baseCls}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col items-center gap-3">
          <TriangleAlert
            className="h-14 w-14 text-amber-500 dark:text-amber-400"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t(titleKey, { defaultValue: titleDefault })}
          </h1>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {normalized}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {needLogin ? (
              <Button asChild>
                <Link to="/login">
                  {t('btn.goLogin', { defaultValue: '로그인으로 이동' })}
                </Link>
              </Button>
            ) : (
              <>
                {showBack && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    aria-label={t('btn.back', { defaultValue: '이전 페이지' })}
                  >
                    {t('btn.back', { defaultValue: '이전 페이지' })}
                  </Button>
                )}
                {showHome && (
                  <Button asChild>
                    <Link to="/">
                      {t('btn.goHome', { defaultValue: '홈으로 이동' })}
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
