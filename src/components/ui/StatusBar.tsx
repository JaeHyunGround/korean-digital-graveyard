import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatusBarProps = {
  children: ReactNode;
  className?: string;
};

export function StatusBar({ children, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-bevel-dark bg-surface px-2 py-[2px] text-[11px] text-ink-muted",
        className
      )}
    >
      {children}
    </div>
  );
}

type StatusPanelProps = {
  children: ReactNode;
  className?: string;
};

export function StatusPanel({ children, className }: StatusPanelProps) {
  return (
    <span
      className={cn(
        "bevel-in-1 inline-block px-1.5 py-[1px] text-[11px] text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
