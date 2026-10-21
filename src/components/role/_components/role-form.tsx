import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateRole } from '@/api/admin/role.ts';
import { LabelSwitch } from '@/components/custom-ui';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
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
import { roleQueries } from '@/queries/role/role.ts';
import {
  RoleUpdateSchema,
  RoleUpdateSchemaValues,
} from '@/schemas/admin/role.ts';

import { useRoleState } from '../_hooks/use-role.tsx';
import { RoleCreateDialog } from './role-create-dialog.tsx';
import { RoleDeleteDialog } from './role-delete-dialog.tsx';

const EMPTY_VALUES: RoleUpdateSchemaValues = {
  id: '',
  name: '',
  description: '',
  isActive: true,
  level: 0,
};

export const RoleForm = () => {
  const { t } = useTranslation();
  const { selectedRole } = useRoleState();
  const dialogDispatch = useDialogDispatch();
  const queryClient = useQueryClient();

  const [openCreate, setOpenCreate] = useState(false);

  const form = useForm<RoleUpdateSchemaValues>({
    resolver: zodResolver(RoleUpdateSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    form.reset(selectedRole ?? EMPTY_VALUES);
  }, [selectedRole, form]);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const updateMutation = useMutation({
    mutationFn: updateRole,
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (!selectedRole) return;
    updateMutation.mutate(values, {
      onSuccess: async () => {
        toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
        await queryClient.invalidateQueries({ queryKey: roleQueries.list().queryKey });
      },
      onError: (e) => {
        console.error(e);
        toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
      },
    });
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('col.role.detail', { defaultValue: '역할 정보' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.role.id', { defaultValue: '역할 ID' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.role.name', { defaultValue: '권한명' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      {t('col.role.description', { defaultValue: '설명' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('col.role.level', { defaultValue: '레벨' })}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <LabelSwitch
                      label={t('col.isActive', { defaultValue: '사용여부' })}
                      field={field}
                    />
                  <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-x-4">
              <Button 
                variant="outline"
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-2"
              >
                <PlusIcon />
                {t('col.role.add', { defaultValue: '역할 추가' })}
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || !selectedRole}
                variant="success"
                className="flex items-center gap-2"
              >
                <CheckIcon />
                {t('btn.save', { defaultValue: '저장' })}
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => dialogDispatch({ type: 'OPEN' })}
                disabled={!selectedRole || updateMutation.isPending}
                className="flex items-center gap-2"
              >
                <Trash2Icon />
                {t('btn.delete', { defaultValue: '삭제' })}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <RoleCreateDialog open={openCreate} onOpenChange={setOpenCreate} />
      <RoleDeleteDialog />
    </>
  );
};
