import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type MenuItem = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
};

type MenuBarProps = {
  logo?: ReactNode;
  items: MenuItem[];
  className?: string;
};

export function MenuBar({ logo, items, className }: MenuBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b-2 border-bevel-dark bg-surface px-2 py-1",
        className
      )}
    >
      {logo && (
        <div className="flex items-center gap-1 text-[14px] font-bold text-primary">
          {logo}
        </div>
      )}
      <nav className="flex flex-wrap gap-[2px]">
        {items.map((item, i) => {
          const cls =
            "px-2 py-[2px] text-[12px] cursor-pointer border border-transparent hover:bevel-out-1 hover:bg-surface";
          if (item.href) {
            return (
              <Link key={i} href={item.href} className={cls}>
                {item.label}
              </Link>
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={item.onClick}
              className={cls}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
