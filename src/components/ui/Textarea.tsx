import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={cn(
        "bg-paper bevel-input w-full resize-y px-2 py-1.5 text-[12px] leading-[1.55] text-ink",
        "placeholder:text-ink-faint",
        "focus:outline-none",
        className
      )}
    />
  );
}
