import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { deleteCode } from '@/api/admin/code.ts';
import { AlertModal } from '@/components/custom-ui';
import { useDialogDispatch, useDialogState } from '@/hooks/use-dialog.tsx';

export const CodeDeleteDialog = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isOpen } = useDialogState();
  const dispatch = useDialogDispatch();

  const deleteCodeMutation = useMutation({
    mutationFn: deleteCode,
  });

  const handleConfirm = () => {
    if (id === undefined) return;

    deleteCodeMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('msg.common.delete.success', {defaultValue: '삭제가 완료되었습니다.'}));
        dispatch({ type: 'CLOSE' });
        navigate('/system/code');
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('msg.common.delete.fail', {defaultValue: '삭제에 실패했습니다.'}));
      },
    });
  };

  return (
    <AlertModal
      open={isOpen}
      title={t('msg.confirm.delete', {
        defaultValue: '정말 삭제하시겠습니까?',
      })}
      description={t('msg.delete.warning', {
        defaultValue: '해당 데이터를 삭제하면 복구가 불가능 합니다.',
      })}
      shouldNotClosed={deleteCodeMutation.isPending}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.delete', { defaultValue: '삭제' })}
      disabledConfirmButton={deleteCodeMutation.isPending}
      onConfirm={handleConfirm}
      onClose={() => dispatch({ type: 'CLOSE' })}
    />
  );
};
