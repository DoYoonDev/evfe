import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { BoardList, useBoardState } from "@/components/board";
import { PageTitle } from "@/components/common";
import { Button } from "@/components/ui/button";

export const BoardPage = () => {
  const { t } = useTranslation();
  
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
  } = useBoardState();

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
        i18nKey="menu.board"
        defaultValue="공지사항"
        rightSlot={
          <Button
            variant="outline" 
            asChild 
            className="flex items-center gap-2"
          >
            <Link to="/board/create">
              <PlusIcon className="h-4 w-4" />
              {t("btn.create", { defaultValue: "등록" })}
            </Link>
          </Button>
        }
      />
      <div className="mt-5 flex flex-col gap-5">
        <BoardList 
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
  )
}

export default BoardPage;