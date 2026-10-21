import { CopyIcon, Maximize2Icon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// JSON이면 보기 좋게, 아니면 원문 그대로
function formatMaybeJson(input: unknown) {
  const raw = typeof input === "string" ? input : JSON.stringify(input);
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw ?? "";
  }
}

function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

type Props = {
  value: unknown;                // row.getValue('requestPayload') 등
  label?: string;                // Dialog 타이틀
  width?: string;                // 셀 내부 트렁케이트 너비 (예: "w-44")
  className?: string;
};

export const LogFieldCell = ({ value, label = "Log", width = "w-44", className }: Props) => {
  const [open, setOpen] = useState(false);
  const pretty = useMemo(() => formatMaybeJson(value), [value]);
  const inlineText = typeof value === "string" ? value : pretty;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className={cn("justify-start text-left p-0", width, className)}>
          <span className={cn("truncate")}>{inlineText}</span>
        </Button>
      </PopoverTrigger>

      {/* 빠른 미리보기: 가벼운 팝오버 */}
      <PopoverContent className="w-[min(70vw,800px)] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copy(pretty)}
              title="Copy"
              aria-label="Copy"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>

            {/* 전체 보기: Dialog로 확장 */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Expand" aria-label="Expand">
                  <Maximize2Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] lg:max-w-5xl">
                <DialogHeader>
                  <DialogTitle>{label}</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <div className="absolute right-3 top-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copy(pretty)}
                      className="h-8"
                    >
                      <CopyIcon className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <pre className="mt-5 max-h-[70vh] overflow-auto whitespace-pre-wrap break-all text-sm font-mono p-3">
                    {pretty}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <pre className="max-h-[40vh] overflow-auto whitespace-pre-wrap break-words text-sm font-mono">
          {pretty}
        </pre>
      </PopoverContent>
    </Popover>
  );
}
