import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PencilIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { updatePassword } from "@/api/admin/member";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordEditSchema, PasswordEditSchemaValue } from "@/schemas/common/password";
import { useAuthStore } from "@/store/use-auth-store";

export const UserPwEdit = () => {
  const { t } = useTranslation();
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<PasswordEditSchemaValue & { confirmPw: string }>({
    resolver: zodResolver(PasswordEditSchema),
    mode: "onChange",
    defaultValues: {
      id: userId || "",
      currentPw: "",
      newPw: "",
      confirmPw: ""
    }
  });

  const newPw = form.watch("newPw");
  const confirmPw = form.watch("confirmPw");
  const matchedPw = newPw === confirmPw && newPw?.length > 0;

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword
  });

  const handleSubmit = form.handleSubmit((values) => {
    updatePasswordMutation.mutate(values, {
      onSuccess: () => {
        toast.success(
          t("msg.user.pwUpdate", { defaultValue: "패스워드 변경에 성공했습니다" })
        );
        navigate(`/user/profile`);
      },
      onError: (error) => {
        console.error(error);
        toast.error(
          t("msg.user.pwFail", { defaultValue: "패스워드 변경에 실패했습니다" })
        );
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 현재 비밀번호 */}
        <FormField
          control={form.control}
          name="currentPw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("col.pwEdit.pw", { defaultValue: "현재 패스워드" })}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 새로운 비밀번호 */}
        <FormField
          control={form.control}
          name="newPw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("col.pwEdit.newPw", { defaultValue: "새로운 패스워드" })}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 비밀번호 확인 */}
        <FormField
          control={form.control}
          name="confirmPw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("col.pwEdit.pwConfirm", { defaultValue: "패스워드 확인" })}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />

              {/* 비밀번호 일치 여부 표시 */}
              {confirmPw?.length > 0 && (
                <p className={`text-sm ${matchedPw ? "text-green-500" : "text-red-500"}`}>
                   {matchedPw ? t("msg.pwEdit.match.ok") : t("msg.pwEdit.match.fail")}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2">
          <Button
            asChild
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <Link to="/user/profile">
              <XIcon className="h-4 w-4" />
              {t("btn.cancel", { defaultValue: "취소" })}
            </Link>
          </Button>
          <Button type="submit" variant="success" className="flex items-center gap-2">
            <PencilIcon className="h-4 w-4" />
            {t("btn.update", { defaultValue: "업데이트" })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
