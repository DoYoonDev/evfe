import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { deleteCodeGroup } from '@/api/admin/code.ts';
import { AlertModal } from '@/components/custom-ui';
import { useDialogDispatch, useDialogState } from '@/hooks/use-dialog.tsx';

export const CodeGroupDeleteDialog = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isOpen } = useDialogState();
  const dispatch = useDialogDispatch();

  const deleteCodeGroupMutation = useMutation({
    mutationFn: deleteCodeGroup,
  });

  const handleConfirm = () => {
    if (id === undefined) return;

    deleteCodeGroupMutation.mutate(id, {
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
      description={t('msg.delete.warning.code.group', {
        defaultValue: '해당 데이터를 삭제하면 복구가 불가능 합니다.\n(주의: 코드 그룹 삭제는 해당 그룹에 속한 코드들도 함께 삭제됩니다.)',
      }).replace(/\\n/g, "\n")}
      shouldNotClosed={deleteCodeGroupMutation.isPending}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.delete', { defaultValue: '삭제' })}
      disabledConfirmButton={deleteCodeGroupMutation.isPending}
      onConfirm={handleConfirm}
      onClose={() => dispatch({ type: 'CLOSE' })}
    />
  );
};
