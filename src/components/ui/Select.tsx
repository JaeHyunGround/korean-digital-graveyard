import type { SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export function Select({ children, className, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className={cn(
        "bg-paper bevel-input px-2 py-1 text-[12px] text-ink",
        "focus:outline-none",
        className
      )}
    >
      {children}
    </select>
  );
}
