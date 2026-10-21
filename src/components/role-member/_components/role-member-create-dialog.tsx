import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckIcon, Loader2Icon, PlusIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { addMemberToRole } from '@/api/admin/role.ts';
import { LoadingErrorFallback, PageablePagination } from '@/components/common';
import { BaseDialog, DebouncedInput, SectionDivider } from '@/components/custom-ui';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { queryClient } from '@/config/query-client';
import { memberQueries } from '@/queries/member/member';
import { roleQueries } from '@/queries/role/role';

export const RoleMemberCreateDialog = ({
  selectedRole,
}: {
  selectedRole: string | null;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const canSearch = open && searchTerm.trim().length >= 2;

   const { data: initData } = useQuery({
    ...memberQueries.listPage({ page: page, size: size }),
    enabled: open && !canSearch,
    staleTime: 0,
  });

  const { data: searchData, isFetching } = useQuery({
    ...memberQueries.search({ q: searchTerm.trim(), page, size }),
    enabled: canSearch,
    staleTime: 0,
  });

  const searchMemberInfos = (canSearch ? searchData : initData)?.memberInfos; 
  const members = searchMemberInfos?.content ?? [];
  const totalElements = searchMemberInfos?.totalElements ?? members.length;

  const totalPages = Math.max(1, Math.ceil((totalElements || 0) / size));

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSelectedUser(null);
      setPage(0);
    }
  }, [open]);

  const addMutation = useMutation({
    mutationFn: addMemberToRole,
  });

  const handleSave = async () => {
    if (!selectedRole || !selectedUser) return;

    addMutation.mutate(
      { id: selectedRole, memberId: selectedUser },
      {
        onSuccess: async () => {
          if (selectedRole) {
            queryClient.invalidateQueries({
              queryKey: roleQueries.roleMemberPagedPrefix(selectedRole),
              refetchType: 'active',
            });
          }
          setOpen(false);
          toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.'}));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
        },
      },
    );
  };

  const renderFallback = () => {
    if (isFetching && members.length === 0) {
      return <LoadingErrorFallback status="loading" />;
    }
    if (!isFetching && members.length === 0) {
      return <LoadingErrorFallback status="error" />;
    }
    return null;
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={setOpen}
      modal={false}
      size="lg"
      title={t('col.role.member.add', { defaultValue: '사용자 추가' })}
      description={t('msg.role.member.add.desc', {
        size,
        defaultValue: '사용자를 검색해 역할에 추가합니다. (최대 {{size}}명 표시)',
      })}
      trigger={
        <Button 
          variant="outline" 
          type="button"
          className="inline-flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          {t('col.role.member.add', { defaultValue: '사용자 추가' })}
        </Button>
      }
      showCancel={true}
      actions={
        <Button
          type="button"
          disabled={!selectedUser || addMutation.isPending}
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          {t('btn.add', { defaultValue: '추가' })}
        </Button>
      }
      bodyScrollable={false}
      bodyClassName="flex flex-col gap-3"
    >
      {/* Search */}
      <div className="shrink-0 px-0 flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <DebouncedInput
            placeholder={t('msg.search.minChars', {count: 2, defaultValue: '최소 {{count}}자 이상 입력하세요.' })}
            value={searchTerm}
            onChange={(v) => {
              setPage(0);
              setSearchTerm(String(v));
            }}
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            disabled={searchTerm.trim().length < 2}
            title={t('btn.search', { defaultValue: '검색' })}
          >
            {isFetching ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <SectionDivider />
      {/* List */}
      <div className="h-[300px] overflow-hidden p-0">
        <ScrollArea className="h-full rounded-md border">
          <div className="p-2" role="listbox" aria-label={t('col.member.list', { defaultValue: '사용자 목록' })}>
            {members.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {renderFallback()}
              </div>
            ) : (
              <div className="space-y-1 pr-2">
                {members.map((member) => {
                  const selected = selectedUser === member.id;
                  return (
                    <div
                      key={member.id}
                      role="option"
                      aria-selected={selected}
                      className={[
                        'flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors',
                        selected
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground',
                      ].join(' ')}
                      onClick={() => setSelectedUser(member.id)}
                      onDoubleClick={() => {
                        setSelectedUser(member.id);
                        if (selectedRole) handleSave();
                      }}
                      title={member.id}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium">
                          {member.id} {member.koName ? `(${member.koName})` : ''}
                        </div>
                      </div>
                      {selected && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <PageablePagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(nextPage) => {
          setPage(nextPage);
        }}
        onSizeChange={(nextSize) => {
          setSize(nextSize);
          setPage(0);
        }}
        showPageSize={false}
      />
    </BaseDialog>
  );
};
