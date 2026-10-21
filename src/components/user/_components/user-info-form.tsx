import { useQuery } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import { useTranslation } from "react-i18next"
import { Link } from "react-router";

import { LoadingErrorFallback } from "@/components/common";
import { Button } from "@/components/ui/button";
import { memberQueries } from "@/queries/member/member";
import { useAuthStore } from "@/store/use-auth-store";

export const UserInfoForm = () => {
  const { t } = useTranslation();
  const { userId } = useAuthStore();

  const { data: memberInfo } = useQuery({
    ...memberQueries.detail(userId as string),
    enabled: !!userId,
  });

  return (
    memberInfo ? (
      <>
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium">
                  {t('col.member.id', {defaultValue: '사용자 아이디'})}
                </dt>
                <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
                  {memberInfo.id}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium">
                  {t('col.member.koName', {defaultValue: '이름 (한글)'})}
                </dt>
                <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
                  {memberInfo.koName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium">
                  {t('col.member.enName', {defaultValue: '이름 (영문)'})}
                </dt>
                <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
                  {memberInfo.enName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium">
                  {t('col.member.email', {defaultValue: '이메일'})}
                </dt>
                <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
                  {memberInfo.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium">
                  {t('col.member.phoneNumber', {defaultValue: '휴대폰 번호'})}
                </dt>
                <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
                  {memberInfo.phoneNumber}
                </dd>
              </div>
          </dl>
        </div>
        <div className="flex justify-end gap-2">
          <Button asChild variant="success" className="flex items-center gap-2">
            <Link to="/user/edit">
              <PencilIcon className="h-4 w-4" />
              {t("btn.update", { defaultValue: "업데이트" })}
            </Link>
          </Button>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-500">
        <LoadingErrorFallback status="error" />;
      </p>
    )
  )
}