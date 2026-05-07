import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type WindowProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  shadow?: boolean;
};

export function Window({
  children,
  shadow = true,
  className,
  ...rest
}: WindowProps) {
  return (
    <div
      {...rest}
      className={cn(
        "bg-surface bevel-out",
        shadow && "shadow-window",
        className
      )}
    >
      {children}
    </div>
  );
}

type WindowBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function WindowBody({ children, className, ...rest }: WindowBodyProps) {
  return (
    <div {...rest} className={cn("p-2", className)}>
      {children}
    </div>
  );
}
