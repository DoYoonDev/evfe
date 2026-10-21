import { useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { useDialogDispatch } from '@/hooks/use-dialog';
import { codeQueries } from '@/queries/code/code';

export const CodeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(codeQueries.detail(id || ''));

  const dispatch = useDialogDispatch();

  return (
    <>
      <div className="border-t border-gray-100 bg-background">
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
              {t('col.code.group.id', { defaultValue: '코드 그룹 아이디' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.codeGroup.id || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.message.id', { defaultValue: '메시지 아이디' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.messageId || '-'}
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
              {t('col.code.sortOrder', { defaultValue: '정렬 순서' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.sortOrder || 0}
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
        <Button variant="secondary" asChild className="flex items-center gap-2">
          <Link to="/system/code">
            <ListIcon className="h-4 w-4" />
            {t('btn.list', { defaultValue: '목록' })}
          </Link>
        </Button>
        <Button asChild variant="success" className="flex items-center gap-2">
          <Link to={`/system/code/${id}/edit`}>
            <PencilIcon className="h-4 w-4" />
            {t('btn.update', { defaultValue: '업데이트' })}
          </Link>
        </Button>
        <Button
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
