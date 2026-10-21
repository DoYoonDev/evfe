import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { deleteBoard } from "@/api/board";
import { AlertModal } from "@/components/custom-ui/_components/alert-modal";
import { useDialogDispatch, useDialogState } from "@/hooks/use-dialog";

export const BoardDeleteDialog = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
  })

  const { isOpen } = useDialogState();
  const dispatch = useDialogDispatch();

  const handleConfirm = () => {
    if (id === undefined) return;

    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        toast.success(t('msg.common.delete.success', {defaultValue: '삭제가 완료되었습니다.'}));
        dispatch({ type: 'CLOSE' });
        navigate('/board');
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('msg.common.delete.fail', {defaultValue: '삭제에 실패했습니다.'}));
        dispatch({ type: 'CLOSE' });
        navigate('/board');
      }
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
      shouldNotClosed={deleteMutation.isPending}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.delete', { defaultValue: '삭제' })}
      disabledConfirmButton={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onClose={() => dispatch({ type: 'CLOSE' })}
    />
  )
}