import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { createRole } from '@/api/admin/role';
import { BaseDialog } from '@/components/custom-ui';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { roleQueries } from '@/queries/role/role';
import { RoleUpdateSchema, RoleUpdateSchemaValues } from '@/schemas/admin/role';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY: RoleUpdateSchemaValues = {
  id: '',
  name: '',
  description: '',
  isActive: true,
  level: 0,
};

export const RoleCreateDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<RoleUpdateSchemaValues>({
    resolver: zodResolver(RoleUpdateSchema),
    defaultValues: EMPTY,
  });

  const resetForm = useCallback(() => {
    form.reset(EMPTY);
    }, [form]);

  useEffect(() => {
    if (open) resetForm();
  }, [open, resetForm]);

  const createMutation = useMutation({ mutationFn: createRole });

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: async () => {
        toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
        await queryClient.invalidateQueries({ queryKey: roleQueries.list().queryKey });
        onOpenChange(false);
      },
      onError: (e) => {
        console.error(e);
        toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
      },
    });
  });

  const formId = 'role-create-form';

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      size="lg"
      title={t('col.role.add', { defaultValue: '역할 추가' })}
      showCancel={true}
      actions={
        <Button
          type="submit"
          form={formId}
          disabled={createMutation.isPending}
          variant="success"
          className="flex items-center gap-2"
        >
          <CheckIcon className="h-4 w-4" />
          {t('btn.save', { defaultValue: '저장' })}
        </Button>
      }
    >
      <div className="py-1">
        <Form {...form}>
          <form id={formId} onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('col.role.id', { defaultValue: '역할 ID' })}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('col.role.name', { defaultValue: '권한명' })}</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('col.role.description', { defaultValue: '설명' })}</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('col.role.level', { defaultValue: '레벨' })}</FormLabel>
                  <FormControl><Input {...field} type="number" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </BaseDialog>
  );
}
