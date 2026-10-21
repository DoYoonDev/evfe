import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PencilIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { updateMember } from "@/api/admin/member";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { memberQueries } from "@/queries/member/member";
import { InfoEditSchema, InfoEditSchemaValues } from "@/schemas/common/info";
import { useAuthStore } from "@/store/use-auth-store";

export const UserInfoEdit = () => {
  const { t } = useTranslation();
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  const { data: member } = useQuery({
    ...memberQueries.detail(userId as string),
    enabled: !!userId,
  });

  const form = useForm<InfoEditSchemaValues>({
    resolver: zodResolver(InfoEditSchema),
    defaultValues: {
      id: '',
      koName: '',
      enName: '',
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (!member) return;
    form.reset({
      id: member.id ?? '',
      koName: member.koName ?? '',
      enName: member.enName ?? '',
      email: member.email ?? '',
      phoneNumber: member.phoneNumber ?? '',
    });
  }, [member, form]);

  const updateMemberMutation = useMutation({
    mutationFn: updateMember,
  });

  const handleSubmit = form.handleSubmit((values) => {
    updateMemberMutation.mutate(
      { ...values }, 
      {
        onSuccess: () => {
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
          navigate(`/user/profile`);
        },
        onError: () => {
          console.error('onError');
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
          name="koName"
          render={({ field }) => 
            <FormItem>
              <FormLabel>
                {t('col.member.koName', {defaultValue: "이름 (한글)"})}
              </FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          }
        />
        <FormField
          control={form.control}
          name="enName"
          render={({ field }) => 
            <FormItem>
              <FormLabel>
                {t('col.member.enName', {defaultValue: "이름 (영문)"})}
              </FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          }
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => 
            <FormItem>
              <FormLabel>
                {t('col.member.email', {defaultValue: "이메일"})}
              </FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          }
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => 
            <FormItem>
              <FormLabel>
                {t('col.member.phoneNumber', {defaultValue: "휴대폰 번호"})}
              </FormLabel>
              <FormControl>
                <Input { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          }
        />
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" type="button" className="flex items-center gap-2">
            <Link to={`/user/profile`}>
              <XIcon className="h-4 w-4" />
              {t('btn.cancel', {defaultValue: "취소"})}
            </Link>
          </Button>
          <Button type="submit" variant="success" className="flex items-center gap-2">
            <PencilIcon className="h-4 w-4" />
            {t("btn.update", { defaultValue: "업데이트" })}
          </Button>
        </div>
      </form>
    </Form>
  )
}
