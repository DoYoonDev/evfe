import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { updateMember } from '@/api/admin/member';
import { LoadingErrorFallback } from '@/components/common';
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
import { memberQueries } from '@/queries/member/member';
import { MemberEditSchema, type MemberEditSchemaValues } from '@/schemas/admin/member';

export const MemberEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, isLoading, isError } = useQuery(memberQueries.detail(id || ''));

  const form = useForm<MemberEditSchemaValues>({
    resolver: zodResolver(MemberEditSchema),
    defaultValues: {
      id: '',
      koName: '',
      enName: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        id: member.id,
        koName: member.koName ?? '',
        enName: member.enName ?? '',
        email: member.email ?? '',
        phoneNumber: member.phoneNumber ?? '',
        isActive: member.isActive ?? true,
      });
    }
  }, [member, form]);

  const {
    mutate: updateMemberMutate,
    status,
  } = useMutation({
    mutationFn: updateMember,
    onSuccess: (_data, variables) => {
      toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
      navigate(`/system/members/${variables.id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
    },
  });

  const isUpdating = status === 'pending';

  const handleSubmit = form.handleSubmit((values) => {
    updateMemberMutate(values);
  });

  if (!id) {
    return (
      <LoadingErrorFallback
        status="custom"
        messageKey="msg.common.noId"
        defaultMessage="ID가 없습니다."
      />
    );
  }
  if (isLoading) {
    return <LoadingErrorFallback status="loading" />;
  }
  if (isError && !member) {
    return <LoadingErrorFallback status="error" />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.member.id', { defaultValue: '사용자 ID' })}</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-gray-100 dark:bg-gray-800" />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="koName"
          render={({ field }) => (
              <FormItem>
              <FormLabel>
                  {t('col.member.koName', { defaultValue: '이름(한글)' })}
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
          name="enName"
          render={({ field }) => (
              <FormItem>
              <FormLabel>
                  {t('col.member.enName', { defaultValue: '이름(영문)' })}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.member.email', { defaultValue: '이메일' })}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('col.member.phoneNumber', { defaultValue: '휴대폰 번호' })}</FormLabel>
              <FormControl>
                <Input type="pthoneNumber" {...field} />
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
                label={t('col.member.isActive', { defaultValue: '활성화' })}
                field={field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/system/members')}
            className="flex items-center gap-2"
          >
            <ListIcon className="h-4 w-4" />
            {t('btn.list', { defaultValue: '목록' })}
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
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
