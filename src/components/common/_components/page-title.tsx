import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

type PageTitleProps = {
  /** i18n key (예: 'menu.menu') */
  i18nKey?: string;
  /** i18n 기본값 또는 바로 보여줄 제목 */
  defaultValue?: string;
  /** 제목 오른쪽 영역 (버튼 등) */
  rightSlot?: React.ReactNode;
  /** 서브 타이틀/설명 */
  subtitle?: React.ReactNode;
  /** 바깥 컨테이너 클래스 */
  className?: string;
  /** h 태그 레벨 조절 (기본 h2) */
  as?: keyof JSX.IntrinsicElements;
};

export const PageTitle: React.FC<PageTitleProps> = ({
  i18nKey,
  defaultValue = 'Title',
  rightSlot,
  subtitle,
  className,
  as = 'h2',
}) => {
  const { t } = useTranslation();
  const TitleTag = as;

  return (
    <div className={cn('mt-2 flex min-w-0 flex-1 items-center justify-between', className)}>
      <div className="min-w-0">
        <TitleTag className="text-2xl font-semibold truncate">
          {i18nKey ? t(i18nKey, { defaultValue }) : defaultValue}
        </TitleTag>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {rightSlot ? <div className="ml-4 shrink-0 flex items-center gap-2">{rightSlot}</div> : null}
    </div>
  );
};
