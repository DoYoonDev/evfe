import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

import { updateMessage } from '@/api/admin/message.ts';
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
import { messagesQueries } from '@/queries/admin/message.ts';
import {
  MessageEditSchema,
  MessageEditSchemaValues,
} from '@/schemas/admin/message.ts';

export const MessageEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  if (id === undefined) {
    throw new Error('id is required');
  }

  const navigate = useNavigate();

  const { data } = useQuery(messagesQueries.detail(id));

  const form = useForm<MessageEditSchemaValues>({
    resolver: zodResolver(MessageEditSchema),
    defaultValues: {
      id: '',
      koText: '',
      enText: '',
      isActive: false,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id,
        koText: data.koText,
        enText: data.enText,
        isActive: data.isActive,
      });
    }
  }, [data, form]);

  const updateMessageMutation = useMutation({
    mutationFn: updateMessage,
  });

  const handleSubmit = form.handleSubmit((values) => {
    updateMessageMutation.mutate(
      { ...values, originalId: id },
      {
        onSuccess: () => {
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
          navigate(`/system/message/${values.id}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
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
                {t('col.message.id', { defaultValue: '메시지 아이디' })}
              </FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="koText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('col.message.ko', { defaultValue: '메시지-한국어' })}
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
          name="enText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('col.message.en', { defaultValue: '메시지-영어' })}
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
            <Link to="/system/message">
              <ListIcon className="h-4 w-4" />
              {t('btn.list', { defaultValue: '목록' })}
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={updateMessageMutation.isPending}
            variant="success"
            className="flex items-center gap-2"
          >
           <PencilIcon className="h-4 w-4" />
            {t('btn.update', { defaultValue: '업데이트' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
