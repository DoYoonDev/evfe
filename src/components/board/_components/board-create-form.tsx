import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ListIcon, PlusIcon } from "lucide-react";
import React, { DragEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VscClose } from "react-icons/vsc";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { createBoard } from "@/api/board";
import { LabelSwitch } from "@/components/custom-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BoardCreateSchema, BoardCreateSchemaValues } from "@/schemas/common/board";
import { useAuthStore } from "@/store/use-auth-store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const BoardCreateForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, roles } = useAuthStore();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const form = useForm<BoardCreateSchemaValues>({
    resolver: zodResolver(BoardCreateSchema),
    defaultValues: {
      attachFileGroupId: "",
      content: "",
      title: "",
      createMemberId: userId || "",
      isPin: false,
    },
  });

  const createBoardMutation = useMutation<boolean, unknown, FormData>({
    mutationFn: createBoard,
  });


  const addFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} 파일이 너무 큽니다. 최대 10MB까지 가능합니다.`);
        return false;
      }
      return true;
    });
    if (validFiles.length) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(values)], { type: "application/json" })
    );
    selectedFiles.forEach((file) => formData.append("attachFiles", file));

    createBoardMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(t('msg.common.create.success', { defaultValue: '추가가 완료되었습니다.' }));
        navigate("/board");
      },
      onError: (error) => {
        console.error(error);
        toast.error(t('msg.common.create.fail', { defaultValue: '추가에 실패하였습니다.' }));
      },
    });
  });

  const renderFormField = (
    name: keyof BoardCreateSchemaValues,
    label: string,
    inputComponent: JSX.Element
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(`col.board.${name}`, { defaultValue: label })}</FormLabel>
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
              {renderFormField("title", "제목", <Input />)}
            </CardHeader>

            <CardContent className="space-y-4">
              {renderFormField("content", "내용", <Textarea rows={6} />)}

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

                {selectedFiles.length > 0 && (
                  <ul className="w-full max-w-md mt-4">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center rounded border border-border bg-muted p-2 text-sm mb-1"
                      >
                        <span>{file.name}</span>
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
                          label={t("col.board.isPin", { defaultValue: "고정 게시글" })} 
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
              className="flex items-center gap-2"
            >
              <ListIcon className="h-4 w-4" />
              {t("btn.list", { defaultValue: "목록" })}
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              {t("btn.create", { defaultValue: "등록" })}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
