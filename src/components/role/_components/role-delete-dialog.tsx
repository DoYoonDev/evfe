import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { deleteRole } from '@/api/admin/role';
import { AlertModal } from '@/components/custom-ui';
import { useDialogDispatch, useDialogState } from '@/hooks/use-dialog';
import { roleQueries } from '@/queries/role/role';

import { useRoleDispatch, useRoleState } from '../_hooks/use-role';

export const RoleDeleteDialog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isOpen } = useDialogState();
  const dialogDispatch = useDialogDispatch();

  const { selectedRole } = useRoleState();
  const roleDispatch = useRoleDispatch();

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
  });

  const handleConfirm = () => {
    const roleId = selectedRole?.id;
    if (!roleId) return;

    deleteMutation.mutate(roleId, {
      onSuccess: async () => {
        roleDispatch({ type: 'SET_SELECTED_ROLE', payload: null });
        await queryClient.invalidateQueries({ queryKey: roleQueries.list().queryKey });
        toast.success(t('msg.common.delete.success', { defaultValue: '삭제가 완료되었습니다.' }));
        dialogDispatch({ type: 'CLOSE' });
        navigate('/system/role');
      },
      onError: (e) => {
        console.error(e);
        toast.error(t('msg.common.delete.fail', { defaultValue: '삭제에 실패했습니다.' }));
        dialogDispatch({ type: 'CLOSE' });
        navigate('/system/role');
      },
    });
  };

  return (
    <AlertModal
      open={isOpen}
      title={t('msg.confirm.delete', { defaultValue: '정말 삭제하시겠습니까?' })}
      description={t('msg.delete.warning', { defaultValue: '해당 데이터를 삭제하면 복구가 불가능 합니다.' })}
      shouldNotClosed={deleteMutation.isPending}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.delete', { defaultValue: '삭제' })}
      disabledConfirmButton={deleteMutation.isPending || !selectedRole}
      onConfirm={handleConfirm}
      onClose={() => dialogDispatch({ type: 'CLOSE' })}
    />
  );
};
