import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ListIcon, PencilIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"
import { VscClose } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { updateBoard } from "@/api/board";
import { LabelSwitch } from "@/components/custom-ui/_components/label-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { boardQueries } from "@/queries/board/board";
import { BoardEditSchema, BoardEditSchemaValues } from "@/schemas/common/board";
import { useAuthStore } from "@/store/use-auth-store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type BoardFile = File | { id: number; fileName: string; url: string };

export const BoardEditForm = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId, roles } = useAuthStore();

  const { data: board } = useQuery(boardQueries.detail(id || ''));

  const [files, setFiles] = useState<BoardFile[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const form = useForm<BoardEditSchemaValues>({
    resolver: zodResolver(BoardEditSchema),
    defaultValues: {
      id: Number(id),
      attachFileGroupId: "",
      content: "",
      title: "",
      updateMemberId: userId || "",
      isPin: false,
    },
  });

  // 기존 데이터 로드
  React.useEffect(() => {
    if (board) {
      form.reset({
        id: Number(id),
        attachFileGroupId: board.attachFileGroupId || "",
        title: board.title,
        content: board.content,
        updateMemberId: userId || "",
        isPin: board.isPin
      });

      setFiles(
        (board.attachFiles || []).map(file => ({
          id: file.id,
          fileName: file.name,
          url: file.path
        }))
      );
    }
  }, [board, form, userId, id]);

  const addFiles = (newFiles: FileList) => {
    const validFiles: File[] = [];
    Array.from(newFiles).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} 파일이 너무 큽니다. 최대 10MB까지 가능합니다.`);
      } else validFiles.push(file);
    });
    if (validFiles.length) setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard
  })

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData();

    formData.append(
      "board",
      new Blob([JSON.stringify(values)], { type: "application/json" })
    );

    files.forEach((file) => {
      // file이 File이면 그대로 append
      if (file instanceof File) {
        formData.append("attachFiles", file);
      } else {
        // 기존 파일 정보도 그냥 JSON Blob으로 append
        formData.append(
          "attachFiles",
          new Blob([JSON.stringify(file)], { type: "application/json" }),
          file.fileName // 이름도 넣어주면 서버 로그 등 확인에 편리
        );
      }
    });

    updateBoardMutation.mutate(
      { id: values.id, formData },
      {
        onSuccess: () => {
          toast.success(t('msg.common.update.success', { defaultValue: '수정이 완료되었습니다.' }));
          navigate(`/board/${values.id}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error(t('msg.common.update.fail', { defaultValue: '수정에 실패하였습니다.' }));
        },
      }
    );
  });

  const renderFormField = (
    name: keyof BoardEditSchemaValues,
    label: string,
    inputComponent: JSX.Element
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(inputComponent, { ...field })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              {renderFormField("title", t("col.board.title", { defaultValue: "제목" }), <Input />)}
            </CardHeader>

            <CardContent className="space-y-4">
              {renderFormField("content", t("col.board.content", { defaultValue: "내용" }), <Textarea rows={6} />)}

              <div>
                <FormLabel>{t("col.board.attachFile", { defaultValue: "첨부파일" })}</FormLabel>
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-10 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <p className="mb-2 text-sm text-muted-foreground">
                    {t("msg.board.dragFiles", { defaultValue: "파일을 여기 끌어오거나" })}
                  </p>
                  <Button
                    type="button"
                    className="relative w-32 h-8 text-sm flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-colors"
                  >
                    {t("col.board.fileSelect", { defaultValue: "파일선택" })}
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                </div>

                {files.length > 0 && (
                  <ul className="w-full max-w-md mt-4">
                    {files.map((file, index) => (
                      <li
                        key={'id' in file ? file.id : index}
                        className="flex justify-between items-center rounded border border-border bg-muted p-2 text-sm mb-1"
                      >
                        <span>{'fileName' in file ? file.fileName : file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <VscClose size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {
                roles && roles.includes("ROLE_ADMIN") ? (
                  <FormField
                    control={form.control}
                    name="isPin"
                    render={({ field }) => (
                      <FormItem>
                        <LabelSwitch
                          label={t("col.board.isPin", { defaultValue: "고정여부" })}
                          field={field}
                          disabled={false}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null
              }
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/board")}
            >
              <ListIcon className="h-4 w-4" />
              {t("btn.list", { defaultValue: "목록" })}
            </Button>
            <Button type="submit" variant="success" className="items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              {t("btn.update", { defaultValue: "업데이트" })}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )

}