import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { resetMemberPassword } from '@/api/admin/member';
import { AlertModal } from '@/components/custom-ui';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string;
  onSuccess?: () => void;
};

export const MemberPasswordResetDialog = ({
  open,
  onOpenChange,
  memberId,
  onSuccess,
}: Props) => {
  const { t } = useTranslation();

  const resetMutation = useMutation({
    mutationFn: resetMemberPassword,
    onSuccess: () => {
      toast.success(
        t('msg.member.resetPassword.success', {
          defaultValue: '비밀번호가 초기화되었습니다.',
        }),
      );
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        t('msg.member.resetPassword.fail', {
          defaultValue: '비밀번호 초기화에 실패했습니다.',
        }),
      );
      onOpenChange(false);
    },
  });

  const handleConfirm = () => {
    if (!memberId) return;
    resetMutation.mutate(memberId);
  };

  return (
    <AlertModal
      open={open}
      title={t('msg.member.resetPassword.title', {
        defaultValue: '비밀번호 초기화',
      })}
      description={t('msg.member.resetPassword.confirm', {
        memberId,
        defaultValue: `비밀번호를 초기화하시겠습니까? (ID: ${memberId ?? ''})`,
      })}
      shouldNotClosed={resetMutation.isPending}
      confirmButtonVariant="destructive"
      confirmButtonText={t('btn.reset', { defaultValue: '초기화' })}
      disabledConfirmButton={resetMutation.isPending}
      onConfirm={handleConfirm}
      onClose={() => onOpenChange(false)}
    />
  );
};
