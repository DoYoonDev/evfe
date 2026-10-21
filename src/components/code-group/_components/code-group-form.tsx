import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ListIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'sonner';

import { createCodeGroup } from '@/api/admin/code.ts';
import { LabelSwitch } from '@/components/custom-ui';
import { Button } from '@/components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  CodeGroupCreateSchema,
  CodeGroupCreateSchemaValues,
} from '@/schemas/admin/code.ts';

export const CodeGroupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<CodeGroupCreateSchemaValues>({
    resolver: zodResolver(CodeGroupCreateSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      isActive: false,
    },
  });

  const { isSubmitting } = form.formState;

  const createCodeGroupMutation = useMutation({
    mutationFn: createCodeGroup,
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (createCodeGroupMutation.isPending) return;

    createCodeGroupMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
        navigate(`/system/code/code-group/${values.id}`);
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.code.id', { defaultValue: '코드 아이디' })}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.code.name', { defaultValue: '코드명' })}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.code.desc', { defaultValue: '코드 설명' })}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" asChild>
            <Link to="/system/code" className="inline-flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              {t('btn.list', { defaultValue: '목록' })}
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            {t('btn.create', { defaultValue: '등록' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
