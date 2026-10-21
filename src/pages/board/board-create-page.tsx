import { BoardCreateForm } from "@/components/board/";
import { PageTitle } from "@/components/common";

export const BoardCreatePage = () => {
  return (
    <>
      <PageTitle
        i18nKey="col.board.new"
        defaultValue="게시글 작성"
      />
      <div className="mt-5 flex flex-col gap-5">
        <BoardCreateForm />
      </div>
    </>
  )
}

export default BoardCreatePage;