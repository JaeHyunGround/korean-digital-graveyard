import { cn } from "@/lib/cn";

type DividerProps = {
  className?: string;
};

/** 윈도우 98 음각 가로선 (위 어둠 + 아래 밝음으로 패인 효과) */
export function Divider({ className }: DividerProps) {
  return (
    <hr
      className={cn(
        "h-0 border-0 border-t border-b border-t-bevel-dark border-b-bevel-light",
        className
      )}
    />
  );
}
