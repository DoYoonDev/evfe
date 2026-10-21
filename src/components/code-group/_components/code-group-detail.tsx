import { useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { Button } from '@/components/ui/button.tsx';
import { useDialogDispatch } from '@/hooks/use-dialog.tsx';
import { codeQueries } from '@/queries/code/code.ts';

export const CodeGroupDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(codeQueries.groupDetail(id || ''));

  const dispatch = useDialogDispatch();

  return (
    <>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.code.id', { defaultValue: '코드 아이디' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.id || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.code.name', { defaultValue: '코드명' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.name || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.code.desc', { defaultValue: '코드 설명' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.description || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.isActive', { defaultValue: '사용여부' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.isActive
                ? t('common.enabled', { defaultValue: '활성화' })
                : t('common.disabled', { defaultValue: '비활성화' })}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" asChild className="flex items-center gap-2">
          <Link to="/system/code">
            <ListIcon className="h-4 w-4" />
            {t('btn.list', { defaultValue: '목록' })}
          </Link>
        </Button>
        <Button type="button" asChild variant="success" className="flex items-center gap-2">
          <Link to={`/system/code/code-group/${id}/edit`}>
            <PencilIcon className="h-4 w-4" />
            {t('btn.update', { defaultValue: '업데이트' })}
          </Link>
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => id && dispatch({ type: 'OPEN' })}
          className="flex items-center gap-2"
        >
          <Trash2Icon className="h-4 w-4" />
          {t('btn.delete', { defaultValue: '삭제' })}
        </Button>
      </div>
    </>
  );
};
