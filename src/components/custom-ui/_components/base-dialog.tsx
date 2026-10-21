import { XIcon } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type BaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: string | null;
  children?: React.ReactNode;

  /** Footer */
  footerLeft?: React.ReactNode;
  actions?: React.ReactNode;
  showCancel?: boolean;

  /** Layout */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  modal?: boolean;
  contentClassName?: string;

  /** Body 스크롤 제어 */
  bodyScrollable?: boolean;               // true면 body가 내부 스크롤
  bodyClassName?: string;                 // body 래퍼에 추가 클래스
};

const sizeClass: Record<NonNullable<BaseDialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'sm:max-w-[540px] md:max-w-[720px]',
  lg: 'max-w-xl',
  xl: 'w-[95vw] max-w-3xl',
};

export const BaseDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footerLeft,
  actions,
  showCancel = true,
  size = 'md',
  modal = false,
  contentClassName,
  bodyScrollable = false,
  bodyClassName,
}: BaseDialogProps) => {
  const { t } = useTranslation();

  const hasFooter = showCancel || !!actions || !!footerLeft;

  const desc = (description ?? '').trim();
  const hasDesc = desc.length > 0;
  const descId = hasDesc ? 'dialog-description' : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        className={cn(
          'max-h-[85vh] w-[95vw] flex flex-col !overflow-hidden',
          sizeClass[size],
          contentClassName,
        )}
        {...(hasDesc ? { 'aria-describedby': descId } : {})}
      >
        {/* Header */}
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {hasDesc && <DialogDescription id={descId}>{desc}</DialogDescription>}
        </DialogHeader>

        {/* Divider */}
        <SectionDivider />

        {/* Body */}
        <div
          className={cn(
            'flex-1 min-h-0',                            // 부모가 flex일 때 내부 스크롤 허용
            bodyScrollable && 'overflow-y-auto',         // 필요 시 바디 전체 스크롤
            bodyClassName,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {hasFooter ? (
          <>
            <SectionDivider />
            <DialogFooter className="shrink-0 w-full">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{footerLeft}</div>
                <div className="flex items-center gap-2">
                  {showCancel && (
                    <Button 
                      type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      <XIcon className="h-4 w-4" />
                      {t('btn.cancel', { defaultValue: '취소' })}
                    </Button>
                  )}
                  {actions}
                </div>
              </div>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/** 섹션 구분선 */
export const SectionDivider = ({ className }: { className?: string }) => {
  return <div className={cn('-mx-6 border-t border-border/60', className)} />;
}
