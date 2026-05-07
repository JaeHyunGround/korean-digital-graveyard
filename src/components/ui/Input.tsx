import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cn(
        "bg-paper bevel-input w-full px-2 py-1 text-[12px] text-ink",
        "placeholder:text-ink-faint",
        "focus:outline-none",
        "disabled:bg-surface disabled:text-ink-soft",
        className
      )}
    />
  );
}
