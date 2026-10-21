import { useQuery } from '@tanstack/react-query';
import { ListIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { Button } from '@/components/ui/button.tsx';
import { useDialogDispatch } from '@/hooks/use-dialog.tsx';
import { messagesQueries } from '@/queries/admin/message.ts';

export const MessageDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(messagesQueries.detail(id || ''));

  const dispatch = useDialogDispatch();

  return (
    <>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.message.id', { defaultValue: '메시지 아이디' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.id || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.message.ko', { defaultValue: '메시지-한국어' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.koText || '-'}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium">
              {t('col.message.en', { defaultValue: '메시지-영어' })}
            </dt>
            <dd className="mt-1 text-sm/6 sm:col-span-2 sm:mt-0">
              {data?.enText || '-'}
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
        <Button asChild variant="secondary" type="button" className="flex items-center gap-2">
          <Link to="/system/message">
            <ListIcon className="h-4 w-4" />
            {t('btn.list', { defaultValue: '목록' })}
          </Link>
        </Button>
        <Button
          asChild
          type="button"
          disabled={!id}
          variant="success"
          className="flex items-center gap-2"
        >
          <Link
            to={id ? `/system/message/${id}/edit` : '#'}
            aria-disabled={!id}
            onClick={(e) => { if (!id) e.preventDefault(); }}
          >
            <PencilIcon className="h-4 w-4" />
            {t('btn.update', { defaultValue: '업데이트' })}
          </Link>
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => id && dispatch({ type: 'OPEN' })}
          disabled={!id}
          className="flex items-center gap-2"
        >
          <Trash2Icon className="h-4 w-4" />
          {t('btn.delete', { defaultValue: '삭제' })}
        </Button>
      </div>
    </>
  );
};
