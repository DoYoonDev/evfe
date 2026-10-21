import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { Message } from 'postcss';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { deployTranslatedMessagesAll } from '@/api/admin/message';
import { PageablePagination, PageTitle } from '@/components/common';
import { DataTable } from '@/components/custom-ui';
import {
  MessageColumns,
  MessageProvider,
  MessageSearch,
  useMessageActions,
  useMessageState} from '@/components/message';
import { Button } from '@/components/ui/button';
import { messagesQueries } from '@/queries/admin/message';

const MessagePage = () => {
  const { t } = useTranslation();

  const {
    page,
    pageSize,
    search: { id, koText, enText, isActive },
  } = useMessageState();
  const { setPage, setPageSize } = useMessageActions();

  const { data } = useQuery(
    messagesQueries.list({
      page,
      size: pageSize,
      id,
      koText,
      enText,
      isActive,
    }),
  );
  const messageInfos = useMemo(() => {
    return (
      data?.content?.map((it: Message) => ({
        ...it,
        url: `/system/message/${it.id}`,
      })) || []
    );
  }, [data]);

  const columns = useMemo(() => MessageColumns(t), [t]);
  const pageCount = Math.max(0, data?.totalPages ?? 0);

  const table = useReactTable({
    data: messageInfos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data?.totalElements || 0,
    pageCount,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: page, pageSize })
          : updater;
      if (next.pageSize !== pageSize) {
        setPageSize(next.pageSize);
        setPage?.(0);
      }
      if (next.pageIndex !== page) {
        setPage?.(next.pageIndex);
      }
    },
  });

  const handleDeploy = () => {
    deployTranslatedMessagesAll().then(() => {
      toast.success(
        t('msg.message.localized', {
          defaultValue: '메시지가 다국어 반영되었습니다.',
        }),
      );
    });
  };

  const handlePageChange = (nextPage: number) => {
    const last = Math.max(0, pageCount - 1);
    const safe = Math.min(Math.max(0, nextPage), last);
    setPage?.(safe);
  };

  const handleSizeChange = (nextSize: number) => {
    setPageSize(nextSize);
    setPage?.(0);
  };

  useEffect(() => {
    setPage?.(0);
  }, [id, koText, enText, isActive, setPage]);

  return (
    <>
      <PageTitle
        i18nKey="menu.message"
        defaultValue="메시지 관리"
        rightSlot={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDeploy}
              className="inline-flex items-center gap-2"
            >
              <CheckIcon className="h-4 w-4" />
              {t('btn.message.i18n', { defaultValue: '메시지 다국어 반영' })}
            </Button>
            <Button
              type="button"
              variant="outline" 
              asChild 
              className="inline-flex items-center gap-2"
            >
              <Link to="/system/message/new">
                <PlusIcon className="h-4 w-4" />
                {t('btn.create', { defaultValue: '등록' })}
              </Link>
            </Button>
          </div>
        }
      />
      <div className="mt-5 flex flex-col gap-5">
        <MessageSearch />
        <DataTable table={table} columns={columns} />
        <PageablePagination
          page={page}
          size={pageSize}
          totalPages={data?.totalPages}
          totalElements={data?.totalElements}
          onPageChange={handlePageChange}
          onSizeChange={handleSizeChange}
          showPageSize={true}
        />
      </div>
    </>
  );
};

export const MessagePageContainer = () => {
  return (
    <MessageProvider>
      <MessagePage />
    </MessageProvider>
  );
};

export default MessagePageContainer;