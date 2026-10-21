import { BoardDeleteDialog, BoardDetail } from '@/components/board';
import { PageTitle } from '@/components/common';

export const BoardDetailPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.board.detail"
        defaultValue="게시글 상세"
      />
      <div className="mt-5 flex flex-col gap-5">
        <BoardDetail />
      </div>
      <BoardDeleteDialog />
    </>
  )
};

export default BoardDetailPage;