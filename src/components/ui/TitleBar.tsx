import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TitleBarProps = {
  title: ReactNode;
  size?: "default" | "compact";
  showButtons?: boolean;
  onClose?: () => void;
  className?: string;
};

export function TitleBar({
  title,
  size = "default",
  showButtons = true,
  onClose,
  className,
}: TitleBarProps) {
  const sizeClass =
    size === "compact"
      ? "text-[11px] py-0.5 px-1.5"
      : "text-[12px] py-[3px] px-1.5";
  const btnSize =
    size === "compact" ? "h-3 w-4 text-[8px]" : "h-3.5 w-4 text-[10px]";

  return (
    <div
      className={cn(
        "bg-titlebar flex select-none items-center justify-between font-bold text-on-primary",
        sizeClass,
        className
      )}
    >
      <span className="truncate">{title}</span>
      {showButtons && (
        <div className="flex shrink-0 gap-[2px]">
          <TitleBarButton size={btnSize} aria-label="최소화">
            _
          </TitleBarButton>
          <TitleBarButton size={btnSize} aria-label="최대화">
            □
          </TitleBarButton>
          <TitleBarButton
            size={btnSize}
            aria-label="닫기"
            onClick={onClose}
          >
            ✕
          </TitleBarButton>
        </div>
      )}
    </div>
  );
}

function TitleBarButton({
  children,
  size,
  onClick,
  ...rest
}: {
  children: ReactNode;
  size: string;
  onClick?: () => void;
  ["aria-label"]?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...rest}
      className={cn(
        "bg-surface bevel-out-1 flex items-center justify-center font-bold text-ink hover:bg-surface-muted active:bevel-in-1",
        size
      )}
    >
      {children}
    </button>
  );
}
