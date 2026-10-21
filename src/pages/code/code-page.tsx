import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  CodeColumns,
  CodeList,
  CodePagination,
  CodeProvider,
  CodeSearch,
  useCodeState,
} from '@/components/code';
import {
  CodeGroupColumns,
  CodeGroupList,
  CodeGroupPagination,
  CodeGroupProvider,
  CodeGroupSearch,
  useCodeGroupState,
} from '@/components/code-group';
import { PageTitle } from '@/components/common';
import { Button } from '@/components/ui/button.tsx';
import { codeQueries } from '@/queries/code/code.ts';
import type { Code } from '@/types/admin/code.ts';

export const CodePage = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <CodeGroupProvider>
      <CodeProvider>
        <CodeGroupContainer setSelectedGroupId={setSelectedGroupId} />
        <CodeContainer selectedGroupId={selectedGroupId} />
      </CodeProvider>
    </CodeGroupProvider>
  );
};

const CodeGroupContainer = ({
  setSelectedGroupId,
}: {
  setSelectedGroupId: (groupId: string | null) => void;
}) => {
  const { t } = useTranslation();
  const {
    codeGroup: { page: codeGroupPage, search: codeGroupSearch },
  } = useCodeGroupState();

  const { data } = useQuery(
    codeQueries.groupList({ page: codeGroupPage, ...codeGroupSearch }),
  );

  const codeGroupInfos = useMemo(() => data?.content || [], [data]);
  const groupColumns = useMemo(() => CodeGroupColumns(t), [t]);

  const codeGroupTable = useReactTable({
    data: codeGroupInfos,
    columns: groupColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data?.totalElements || 0,
  });

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  return (
    <>
      <PageTitle
        i18nKey="col.code.group"
        defaultValue="코드그룹 관리"
        rightSlot={
          <Button
            variant="outline" 
            asChild 
            className="flex items-center gap-2"
          >
            <Link to="/system/code/code-group/new">
              <PlusIcon className="h-4 w-4" />
              {t('btn.create', { defaultValue: '등록' })}
            </Link>
          </Button>
        }
      />
      <CodeGroupSearch className="py-4" />
      <CodeGroupList
        table={codeGroupTable}
        columns={groupColumns}
        onRowClick={handleGroupSelect}
      />
      <CodeGroupPagination
        currentPage={0}
        isFirst={data?.first}
        isLast={data?.last}
      />
    </>
  );
};

const CodeContainer = ({
  selectedGroupId,
}: {
  selectedGroupId: string | null;
}) => {
  const { t } = useTranslation();
  const {
    code: { page: codePage, search: codeSearch },
  } = useCodeState();

  const { data } = useQuery(
    codeQueries.list(selectedGroupId || '', { page: codePage, ...codeSearch }),
  );

  const codeInfos = useMemo(() => {
    return (
      data?.content?.map((it: Code) => ({
        ...it,
        url: `/system/code/${it.id}`,
      })) || []
    );
  }, [data]);
  const columns = useMemo(() => CodeColumns(t), [t]);

  const codeTable = useReactTable({
    data: codeInfos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data?.totalElements || 0,
  });
  
  return (
    <>
      <PageTitle
        i18nKey="col.code"
        defaultValue="코드 관리"
        rightSlot={
          <Button
            variant="outline" 
            asChild 
            className="flex items-center gap-2"
          >
            <Link to="/system/code/new">
              <PlusIcon className="h-4 w-4" />
              {t('btn.create', { defaultValue: '등록' })}
            </Link>
          </Button>
        }
      />
      <CodeSearch className="py-4" />
      <CodeList table={codeTable} columns={columns} />
      <CodePagination
        currentPage={0}
        isFirst={data?.first}
        isLast={data?.last}
      />
    </>
  );
};

export default CodePage;