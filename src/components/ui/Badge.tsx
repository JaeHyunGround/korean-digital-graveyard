import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = {
  variant: "rip" | "alive";
  children?: ReactNode;
  className?: string;
};

export function Badge({ variant, children, className }: BadgeProps) {
  const label = children ?? (variant === "rip" ? "R.I.P" : "운영중");
  return (
    <span
      className={cn(
        "inline-block px-1 py-[1px] text-[8px] font-bold tracking-[1px] text-white",
        variant === "rip" ? "bg-critical" : "bg-success",
        className
      )}
    >
      {label}
    </span>
  );
}

/** 카드 우상단 절대 배치용 래퍼 */
export function CornerBadge({
  variant,
  children,
  className,
}: BadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn("absolute top-1.5 right-1.5", className)}
    >
      {children}
    </Badge>
  );
}
