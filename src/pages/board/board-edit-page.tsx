import { BoardEditForm } from "@/components/board";
import { PageTitle } from "@/components/common";

export const BoardEditPage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.board.edit"
        defaultValue="게시글 수정"
      />
      <div className="mt-5 flex flex-col gap-5">
        <BoardEditForm />
      </div>
    </>
  )
}

export default BoardEditPage;