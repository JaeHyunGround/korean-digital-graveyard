import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: "sm" | "md";
  block?: boolean;
};

export function Button({
  children,
  size = "md",
  block = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const sizeClass =
    size === "sm"
      ? "px-2 py-[1px] text-[11px]"
      : "px-3 py-[3px] text-[12px]";

  return (
    <button
      type={type}
      {...rest}
      className={cn(
        "bg-surface bevel-out cursor-pointer font-bold text-ink",
        "hover:bg-surface-muted",
        "active:bevel-in",
        "disabled:cursor-not-allowed disabled:text-ink-faint",
        "focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-ink focus-visible:outline-offset-[-4px]",
        sizeClass,
        block && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
