import { useMutation } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { TreeItem } from 'react-complex-tree';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { createMenu } from '@/api/admin/menu.ts';
import { BaseDialog } from '@/components/custom-ui';
import {
  useMenuDialogDispatch,
  useMenuDialogState,
} from '@/components/menu/_hooks/use-menu-dialog.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Menu } from '@/types/common/menu.ts';

export const MenuCreateDialog = ({
  createTreeItem,
}: {
  createTreeItem: (
    id: number,
    parentMenuId: number | null,
    data: TreeItem,
  ) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const { isOpen, parentMenu } = useMenuDialogState();
  const dispatch = useMenuDialogDispatch();

  const createMenuMutation = useMutation({
    mutationFn: createMenu,
  });

  const invalid = name.trim().length === 0;
  const isPending = createMenuMutation.isPending;

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE' });
  }, [dispatch]);

  const handleConfirm = () => {
    if (!parentMenu) {
      toast.error(
        t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }),
      );
      return;
    }

    if (invalid || isPending) return;

    createMenuMutation.mutate(
      {
        parentMenuId: parentMenu.data.id,
        name: name.trim(),
        level: parentMenu.data.level ? parentMenu.data.level + 1 : 1,
        isActive: false,
        isDelete: false,
        sortOrder: parentMenu.children ? parentMenu.children.length + 1 : 1,
      },
      {
        onSuccess: (data) => {
          const menu: Menu = data.menuInfo;
          createTreeItem(menu.id, menu.parentMenuId, {
            index: menu.id,
            isFolder: false,
            children: [],
            data: menu,
          });
          setName('');
          toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
          handleClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
          handleClose();
        },
      },
    );
  };

  return (
    <BaseDialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={t('msg.menu.create.title', { defaultValue: '새 메뉴 추가' })}
      description={t('msg.menu.create.desc', { defaultValue: '메뉴 정보를 입력해 주세요.' })}
      size="md"
      actions={
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={invalid || isPending}
          variant="success"
          className="flex items-center gap-2"
        >
          <CheckIcon className="h-4 w-4" />
          {t('btn.save', { defaultValue: '저장' })}
        </Button>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
        className="space-y-2"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !invalid && !isPending) {
              e.preventDefault();
              handleConfirm();
            }
          }}
          aria-invalid={invalid}
        />
      </form>
    </BaseDialog>
  );
};
