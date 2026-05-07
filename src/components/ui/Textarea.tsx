import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={cn(
        "bg-paper bevel-in-1 w-full resize-y px-1.5 py-1 text-[12px] leading-[1.4] text-ink",
        "placeholder:text-ink-faint",
        "focus:outline-none",
        className
      )}
    />
  );
}
