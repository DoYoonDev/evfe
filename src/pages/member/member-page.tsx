import { PageTitle } from '@/components/common';
import { MemberList, useMemberState } from '@/components/member';

export const MemberPage = () => {
  const {
    inputKeyword,
    setInputKeyword,
    selectedColumn,
    setSelectedColumn,
    handleKeyDown,
    searchParams,
    triggerSearch,
    changePage,
    changeItemsPerPage,
    changeSort,
  } = useMemberState();

  const {
    searchColumn,
    searchKeyword,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
  } = searchParams;

  return (
    <>
      <PageTitle
        i18nKey="menu.member"
        defaultValue="사용자 관리"
      />
      <div className="mt-5 flex flex-col gap-5">
        <MemberList
          // 입력 상태 (검색 입력창)
          inputKeyword={inputKeyword}
          setInputKeyword={setInputKeyword}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
          onSearch={triggerSearch}
          onKeywordKeyDown={handleKeyDown}

          // 확정된 검색 조건
          searchColumn={searchColumn}
          searchKeyword={searchKeyword}

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

export default MemberPage;