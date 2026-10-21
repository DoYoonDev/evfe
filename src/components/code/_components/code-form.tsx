import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ListIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createCode } from '@/api/admin/code';
import { LabelSwitch } from '@/components/custom-ui';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  CodeCreateSchema,
  CodeCreateSchemaValues,
} from '@/schemas/admin/code';

export const CodeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<CodeCreateSchemaValues>({
    resolver: zodResolver(CodeCreateSchema),
    defaultValues: {
      id: '',
      groupId: '',
      messageId: '',
      name: '',
      description: '',
      sortOrder: 0,
      isActive: false,
    },
  });

  const createCodeMutation = useMutation({
    mutationFn: createCode,
  });

  const handleSubmit = form.handleSubmit((values) => {
    createCodeMutation.mutate(
      { ...values },
      {
        onSuccess: () => {
          toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
          navigate(`/system/code/${values.id}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
        },
      },
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('col.code.id', { defaultValue: '코드 아이디' })}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('col.code.group.id', { defaultValue: '코드그룹 아이디' })}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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
              <FormLabel>
                {t('col.code.name', { defaultValue: '코드명' })}
              </FormLabel>
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
              <FormLabel>
                {t('col.code.desc', { defaultValue: '코드 설명' })}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('col.code.sortOrder', { defaultValue: '정렬 순서' })}
              </FormLabel>
              <FormControl>
                <Input {...field} type={'number'} />
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
          <Button
            asChild
            variant="secondary"
            type="button"
            className="flex items-center gap-2"
          >
            <Link to="/system/code">
              <ListIcon className="h-4 w-4" />
              {t('btn.list', { defaultValue: '목록' })}
            </Link>
          </Button>
          <Button 
            type="submit" 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            {t('btn.create', { defaultValue: '등록' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
