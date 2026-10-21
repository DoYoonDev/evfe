
import { PageTitle } from '@/components/common';
import { LoginLogList, useLoginLogState} from '@/components/log';

export const LogLoginPage = () => {
  const {
    userId,
    setUserId,
    accessedAt,
    setAccessedAt,
    handleKeyDown,
    searchParams,
    triggerSearch,
    changePage,
    changeItemsPerPage,
    changeSort,
  } = useLoginLogState();

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
        i18nKey="menu.log.login"
        defaultValue="로그인로그 관리"
      />
      <div className="mt-5 flex flex-col gap-5">
        <LoginLogList
          // 입력 상태 (검색 입력창)
          userId={userId}
          setUserId={setUserId}
          accessedAt={accessedAt}
          setAccessedAt={setAccessedAt}
          onSearch={triggerSearch}
          onKeywordKeyDown={handleKeyDown}

          // 확정된 검색 조건
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

export default LogLoginPage;