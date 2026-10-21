import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { updateCode } from '@/api/admin/code';
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
import { codeQueries } from '@/queries/code/code.ts';
import { CodeEditSchema, CodeEditSchemaValues } from '@/schemas/admin/code.ts';

export const CodeEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  if (id === undefined) {
    throw new Error('id is required');
  }

  const navigate = useNavigate();

  const { data } = useQuery(codeQueries.detail(id));

  const form = useForm<CodeEditSchemaValues>({
    resolver: zodResolver(CodeEditSchema),
    defaultValues: {
      id: '',
      groupId: '',
      messageId: '',
      name: '',
      description: '',
      sortOrder: undefined,
      isActive: false,
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      id: data.id,
      groupId: data.codeGroup.id,
      messageId: data.messageId,
      name: data.name,
      description: data.description,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
  }, [data, form]);

  const handleSubmit = form.handleSubmit((values) => {
    updateCode({ ...values, groupId: values.groupId })
      .then((response) => {
        if (response) {
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
          navigate(`/system/code/${values.id}`);
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
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
              <FormLabel>
                {t('col.code.id', { defaultValue: '코드 아이디' })}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  aria-readonly
                />
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
                {t('col.code.group.id', { defaultValue: '코드 그룹 아이디' })}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  aria-readonly
                />
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
          <Button type="button" variant="secondary" asChild className="flex items-center gap-2">
            <Link to="/system/code">
              <ListIcon className="h-4 w-4" />
              {t('btn.list', { defaultValue: '목록' })}
            </Link>
          </Button>

          <Button type="submit" variant="success" className="flex items-center gap-2">
            <PencilIcon className="h-4 w-4" />
            {t('btn.update', { defaultValue: '업데이트' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
