import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { DownloadIcon, ListIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

import { getAttachFile } from "@/api/board";
import { LoadingErrorFallback } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDialogDispatch } from "@/hooks/use-dialog";
import { boardQueries } from "@/queries/board/board";
import { useAuthStore } from "@/store/use-auth-store";

export const BoardDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDialogDispatch();

  const { userId } = useAuthStore();

  const { data: board, isLoading, isError } = useQuery(boardQueries.detail(id || ""));

  const handleDownload = async (id: number, saveName: string, name: string) => {
    try {
      const blob = await getAttachFile(id, saveName);

      // blob -> URL -> 다운로드
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name; // 실제 보여줄 파일명
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("파일 다운로드에 실패했습니다.");
    }
  }

  if (!id) {
     return (
       <LoadingErrorFallback
         status="custom"
         messageKey="msg.noId"
         defaultMessage="ID가 없습니다."
       />
     );
  }
  if (isLoading) {
    return <LoadingErrorFallback status="loading" />;
  }
  if (isError || !board)  {
    return <LoadingErrorFallback status="error" />;
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <h1 className="text-2xl font-bold">{board.title}</h1>
            <div className="col-span-full space-x-4">
              <span>{t("col.board.createMemberId", { defaultValue: "작성자" })}: {board.createMemberId}</span>
              <span>{t("col.board.createdAt", { defaultValue: "작성일" })}: {dayjs(board.updatedAt).format("YYYY-MM-DD HH:mm")}</span>
              <span>{t("col.board.viewCount", { defaultValue: "조회수" })}: {board.viewCount}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">
                {t("col.board.content", { defaultValue: "내용" })}
              </h3>
              <div
                className="
                  min-h-64 max-h-64 overflow-y-auto overflow-x-hidden p-2
                  border border-border rounded-md 
                  bg-muted/50 text-foreground 
                  transition-colors
                  min-w-0
                "
              >
                {board.content ? (
                  <div 
                    className="
                    whitespace-pre-wrap break-words max-w-full
                    [overflow-wrap:anywhere]
                    "
                  >
                    {board.content}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    {t("msg.board.noContent", { defaultValue: "내용이 없습니다." })}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">
                {t("col.board.attachFile", { defaultValue: "첨부파일" })}
              </h3>
              {board.attachFiles && board.attachFiles.length > 0 ? (
                <ul className="space-y-1">
                  {board.attachFiles.map(file => (
                    <li key={file.id}>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDownload(board.id, file.saveName, file.name)}
                        className="
                          flex items-center gap-2
                          text-blue-600 hover:text-blue-700
                          dark:text-primary dark:hover:text-primary/80
                        "
                      >
                        <DownloadIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground italic">
                  {t("msg.board.noAttachment", { defaultValue: "첨부파일이 없습니다." })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" asChild>
            <Link to="/board" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              {t("btn.list", { defaultValue: "목록" })}
            </Link>
          </Button>
          {userId === board.createMemberId && (
            <>
              <Button asChild variant="success" className="items-center gap-2">
                <Link to={`/board/${id}/edit`}>
                  <PencilIcon className="h-4 w-4" />
                  {t("btn.update", { defaultValue: "업데이트" })}
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => dispatch({ type: "OPEN" })}
                className="flex items-center gap-2"
              >
                <Trash2Icon className="h-4 w-4" />
                {t("btn.delete", { defaultValue: "삭제" })}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
