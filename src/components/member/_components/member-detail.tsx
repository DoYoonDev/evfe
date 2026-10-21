import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ListIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { LoadingErrorFallback } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useDialogDispatch } from '@/hooks/use-dialog';
import { memberQueries } from '@/queries/member/member';
import { roleQueries } from '@/queries/role/role';

import { MemberPasswordResetDialog } from './member-password-reset-dialog';

export const MemberDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDialogDispatch();

  const { data: member, isLoading, isError } = useQuery(memberQueries.detail(id || ''));
  const { data: memberRoles = [] } = useQuery(roleQueries.memberRoles(id || ''));

  const [openReset, setOpenReset] = useState(false);
  
  if (!id) {
    return (
      <LoadingErrorFallback
        status="custom"
        messageKey="msg.noId"
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
    <>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 grid grid-cols-4 gap-4 sm:px-0">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.id', { defaultValue: '사용자 ID' })}
            </dt>
            <dd className="text-sm col-span-3">
              {member?.id || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 grid grid-cols-4 gap-4 border-t sm:px-0">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.koName', { defaultValue: '이름 (한글)' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.koName || '-'}
            </dd>

            <dt className="text-sm font-medium col-span-1">
              {t('col.member.enName', { defaultValue: '이름 (영문)' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.enName || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 grid grid-cols-4 gap-4 sm:px-0">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.email', { defaultValue: '이메일' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.email || '-'}
            </dd>
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.phoneNumber', { defaultValue: '휴대폰 번호' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.phoneNumber || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 grid grid-cols-4 gap-4 sm:px-0 border-t">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.createdAt', { defaultValue: '생성일' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.createdAt ? dayjs(member.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </dd>

            <dt className="text-sm font-medium col-span-1">
              {t('col.member.updatedAt', { defaultValue: '수정일' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.updatedAt ? dayjs(member.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </dd>
          </div>
          <div className="px-4 py-6 grid grid-cols-4 gap-4 sm:px-0 border-t">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.isActive', { defaultValue: '활성화 여부' })}
            </dt>
            <dd className="text-sm col-span-1">
              {member?.isActive
                ? t('col.member.activate', { defaultValue: '활성화' })
                : t('col.member.deactivate', { defaultValue: '비활성화' })}
            </dd>
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.roles', { defaultValue: '권한' })}
            </dt>
            <dd className="text-sm col-span-1">
              {memberRoles?.length ? (
                <div className="flex flex-wrap gap-2">
                  {memberRoles.map((role) => {
                    return (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {role}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span>-</span>
              )}
            </dd>
          </div>
          <div className="px-4 py-6 grid grid-cols-4 gap-4 sm:px-0 border-t">
            <dt className="text-sm font-medium col-span-1">
              {t('col.member.resetPassword', { defaultValue: '비밀번호 초기화' })}
            </dt>
            <dd className="text-sm col-span-3">
              <Button
                variant="destructive"
                onClick={() => setOpenReset(true)}
              >
                {t('col.member.resetPassword', { defaultValue: '비밀번호 초기화' })}
              </Button>
              <MemberPasswordResetDialog
                open={openReset}
                onOpenChange={setOpenReset}
                memberId={member?.id ?? ''}
                onSuccess={() => {
                  // 필요하면 refetch();
                }}
              />
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button asChild variant="outline" type="button">
          <Link to="/system/members" className="flex items-center gap-1">
            <ListIcon className="w-4 h-4" />
            {t("btn.list", { defaultValue: "목록" })}
          </Link>
        </Button>
        <Button asChild type="button" className="bg-green-600 hover:bg-green-700 text-white">
          <Link to={`/system/members/${id}/edit`} className="flex items-center gap-1">
            <PencilIcon className="w-4 h-4" />
            {t("btn.update", { defaultValue: "업데이트" })}
          </Link>
        </Button>
        <Button
          variant="destructive"
          type="button"
          onClick={() => dispatch({ type: 'OPEN' })}
          className="flex items-center gap-1"
        >
          <Trash2Icon className="w-4 h-4" />
          {t("btn.delete", { defaultValue: "삭제" })}
        </Button>
      </div>
    </>
  );
};
