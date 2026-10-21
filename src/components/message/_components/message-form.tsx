import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ListIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { createMessage } from '@/api/admin/message.ts';
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
  MessageCreateSchema,
  MessageCreateSchemaValues,
} from '@/schemas/admin/message.ts';

export const MessageForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<MessageCreateSchemaValues>({
    resolver: zodResolver(MessageCreateSchema),
    defaultValues: {
      isActive: false,
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: createMessage,
  });

  const handleSubmit = form.handleSubmit((values) => {
    createMessageMutation.mutate(
      { ...values },
      {
        onSuccess: () => {
          toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
          navigate(`/system/message/${values.id}`);
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
          <Button asChild variant="outline" type="button">
            <Link to="/system/message" className="flex items-center">
              <ListIcon className="h-4 w-4" />
              {t("btn.list", { defaultValue: "목록" })}
            </Link>
          </Button>
          <Button 
            type="submit"
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            {t("btn.create", { defaultValue: "등록" })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
