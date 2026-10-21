
import { PageTitle } from '@/components/common';
import { AccessLogList, useAccessLogState } from '@/components/log';

export const LogAccessPage = () => {
  const {
    userId,
    setUserId,
    accessedAt,
    setAccessedAt,
    searchParams,
    triggerSearch,
    handleKeyDown,
    changeItemsPerPage,
    changePage,
    changeSort,
  } = useAccessLogState();

  const {
    searchUserId,
    searchAccessedAt,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
  } = searchParams;

  return (
    <>
      <PageTitle 
        i18nKey='menu.log.access'
        defaultValue='접근로그 관리'
      />
      <div className="mt-5 flex flex-col gap-5">
        <AccessLogList
          // 입력 상태
          userId={userId}
          setUserId={setUserId}
          accessedAt={accessedAt}
          setAccessedAt={setAccessedAt}
          onSearch={triggerSearch}
          onKeywordKeyDown={handleKeyDown}

          // 검색 조건
          searchUserId={searchUserId}
          searchAccessedAt={searchAccessedAt}

          // 페이징
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={changePage}
          onItemsPerPageChange={changeItemsPerPage}

          // 정렬
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={changeSort}
        />
      </div>
    </>
  );
};

export default LogAccessPage;
