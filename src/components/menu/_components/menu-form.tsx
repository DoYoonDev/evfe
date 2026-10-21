import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckIcon, Trash2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { type TreeItem } from 'react-complex-tree';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteMenu, updateMenu } from '@/api/admin/menu.ts';
import { LabelSwitch } from '@/components/custom-ui';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useDialogDispatch } from '@/hooks/use-dialog.tsx';
import {
  MenuUpdateSchema,
  MenuUpdateSchemaValues,
} from '@/schemas/common/menu.ts';

import { useMenuDispatch, useMenuState } from '../_hooks/use-menu.tsx';
import { MenuDeleteDialog } from './menu-delete-dialog.tsx';

export const MenuForm = ({
  updateTreeItem,
  deleteTreeItem,
}: {
  updateTreeItem: (id: number, data: TreeItem) => void;
  deleteTreeItem: (id: number, parentMenuId: number | null) => void;
}) => {
  const { t } = useTranslation();
  const { selectedMenu } = useMenuState();
  const dialogDispatch = useDialogDispatch();
  const menuDispatch = useMenuDispatch();

  const form = useForm<MenuUpdateSchemaValues>({
    resolver: zodResolver(MenuUpdateSchema),
    defaultValues: {
      name: '',
      parentMenuId: null,
      messageId: '',
      url: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (selectedMenu) {
      form.reset();
      form.setValue('name', selectedMenu?.data.name);
      form.setValue('parentMenuId', selectedMenu?.data.parentMenuId || null);
      form.setValue('messageId', selectedMenu?.data.messageId || '');
      form.setValue('url', selectedMenu?.data.url || '');
      form.setValue('description', selectedMenu?.data.description || null);
      form.setValue('isActive', selectedMenu?.data.isActive);
    }
  }, [form, selectedMenu]);

  const updateMenuMutation = useMutation({
    mutationFn: updateMenu,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (selectedMenu === null) return;
    updateMenuMutation.mutate(
      { ...values, id: selectedMenu.data.id },
      {
        onSuccess: (_, newMenu) => {
          if (selectedMenu === null) return;
          updateTreeItem(selectedMenu.data.id, {
            ...selectedMenu,
            data: {
              ...selectedMenu,
              ...newMenu,
            },
          });
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
        },
      },
    );
  });

  const deleteMenuMutation = useMutation({
    mutationFn: deleteMenu,
  });

  const handleDelete = async () => {
    const menuId = selectedMenu?.data.id;
    const parentMenuId = selectedMenu?.data.parentMenuId;
    if (!menuId || parentMenuId === undefined) return;

    deleteMenuMutation.mutate(menuId, {
      onSuccess: () => {
        menuDispatch({ type: 'SET_SELECTED_MENU', payload: null });
        form.reset();
        deleteTreeItem(menuId, parentMenuId);
        toast.success(t('msg.common.delete.success', {defaultValue: '삭제가 완료되었습니다.'}));
        dialogDispatch({ type: 'CLOSE' });
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('msg.common.delete.fail', {defaultValue: '삭제에 실패했습니다.'}));
      },
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('col.menu.detail', { defaultValue: '메뉴 상세' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.menu.name', { defaultValue: '메뉴 이름' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedMenu} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="messageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.message.id', { defaultValue: '메시지 아이디' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedMenu} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.common.url', { defaultValue: 'URL' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!selectedMenu} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.common.description', { defaultValue: '설명' })}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        disabled={!selectedMenu}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <LabelSwitch
                      label={t('col.isActive', { defaultValue: '사용여부' })}
                      field={field}
                      disabled={!selectedMenu}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-x-4">
              <Button
                variant="default"
                type="submit"
                disabled={updateMenuMutation.isPending || !selectedMenu}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckIcon />
                {t('btn.save.changes', { defaultValue: '변경사항 저장' })}
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => dialogDispatch({ type: 'OPEN' })}
                disabled={updateMenuMutation.isPending || !selectedMenu}
              >
                <Trash2Icon />
                {t('btn.delete', { defaultValue: '삭제' })}
              </Button>
              {updateMenuMutation.isError && (
                <p>{updateMenuMutation.error.message}</p>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
      <MenuDeleteDialog handleDelete={handleDelete} />
    </>
  );
};
