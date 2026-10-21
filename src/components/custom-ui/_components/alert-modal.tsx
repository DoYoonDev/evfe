import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { Button, ButtonProps } from '@/components/ui/button.tsx';

export const AlertModal = ({
  open,
  title,
  description,
  shouldNotClosed = false,
  confirmButtonVariant = 'default',
  confirmButtonText,
  confirmButtonTextKey = 'btn.confirm',
  confirmButtonDefault = '확인',
  disabledConfirmButton = false,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  shouldNotClosed?: boolean;
  disabledConfirmButton?: boolean;
  confirmButtonVariant?: ButtonProps['variant'];
  confirmButtonText?: string;
  confirmButtonTextKey?: string;
  confirmButtonDefault?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const handleChange = (value: boolean) => {
    if (!value && !shouldNotClosed) {
      onClose();
    }
  };

  const renderDescription = () => {
    if (typeof description === 'string') {
      return description.split('\n').map((line, idx) => (
        <p key={idx} className="mb-1">
          {line}
        </p>
      ));
    }
    return description;
  };

  return (
    <AlertDialog open={open} onOpenChange={handleChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{renderDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" type="button">
              {t('btn.cancel', { defaultValue: '취소' })}
            </Button>
          </AlertDialogCancel>
          <Button
            variant={confirmButtonVariant}
            type="button"
            onClick={onConfirm}
            disabled={disabledConfirmButton}
          >
            {confirmButtonText
              ? confirmButtonText
              : t(confirmButtonTextKey ?? 'btn.confirm', {
                  defaultValue: confirmButtonDefault ?? '확인',
                })}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
