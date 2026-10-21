import { useTranslation } from 'react-i18next';

import { AlertModal } from '@/components/custom-ui';
import { useDialogDispatch, useDialogState } from '@/hooks/use-dialog.tsx';

export const MenuDeleteDialog = ({
  handleDelete,
}: {
  handleDelete: () => void;
}) => {
  const { t } = useTranslation();
  const { isOpen } = useDialogState();
  const dispatch = useDialogDispatch();

  return (
    <AlertModal
      open={isOpen}
      title={t('msg.confirm.delete', {
        defaultValue: '정말 삭제하시겠습니까?',
      })}
      description={t('msg.delete.warning.menu', {
        defaultValue: '삭제 시 하위 메뉴들도 함께 삭제됩니다.',
      })}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.delete', { defaultValue: '삭제' })}
      onConfirm={handleDelete}
      onClose={() => {
        dispatch({ type: 'CLOSE' });
      }}
    />
  );
};
