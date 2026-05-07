"use client";

import Link from "next/link";
import { Window, WindowBody, TitleBar, Divider } from "@/components/ui";
import { CATEGORY_EMOJI, type Decade } from "@/lib/format";
import type { ServiceCategory } from "@/lib/database.types";
import { cn } from "@/lib/cn";

const CATEGORIES: ServiceCategory[] = [
  "SNS",
  "메신저",
  "커뮤니티",
  "게임",
  "음악영상",
  "기타",
];

type Props = {
  category: string;
  decade: string;
  total: number;
  categoryCounts: Record<ServiceCategory, number>;
  decadeCounts: Record<Decade, number>;
  onCategoryChange: (cat: string) => void;
  onDecadeChange: (dec: string) => void;
};

export function FilterSidebar({
  category,
  decade,
  total,
  categoryCounts,
  decadeCounts,
  onCategoryChange,
  onDecadeChange,
}: Props) {
  return (
    <Window>
      <TitleBar title="📁 카테고리" size="compact" showButtons={false} />
      <WindowBody className="!p-0 py-1">
        <FilterItem
          label="📂 전체"
          count={total}
          active={category === "전체"}
          onClick={() => onCategoryChange("전체")}
        />
        {CATEGORIES.map((cat) => (
          <FilterItem
            key={cat}
            label={`${CATEGORY_EMOJI[cat]} ${cat}`}
            count={categoryCounts[cat]}
            active={category === cat}
            onClick={() => onCategoryChange(cat)}
          />
        ))}

        <Divider className="my-1" />
        <div className="px-2 py-1 text-[11px] font-bold text-primary">
          ⏱ 연대별
        </div>
        <FilterItem
          label="📅 전체"
          active={decade === "all"}
          onClick={() => onDecadeChange("all")}
        />
        <FilterItem
          label="📅 1990년대"
          count={decadeCounts["1990"]}
          active={decade === "1990"}
          onClick={() => onDecadeChange("1990")}
        />
        <FilterItem
          label="📅 2000년대"
          count={decadeCounts["2000"]}
          active={decade === "2000"}
          onClick={() => onDecadeChange("2000")}
        />
        <FilterItem
          label="📅 2010년대"
          count={decadeCounts["2010"]}
          active={decade === "2010"}
          onClick={() => onDecadeChange("2010")}
        />

        <Divider className="my-1" />
        <div className="px-2 py-1">
          <Link
            href="/submit"
            className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in block w-full px-2 py-[2px] text-center text-[11px] font-bold text-ink"
          >
            + 서비스 제출하기
          </Link>
        </div>
      </WindowBody>
    </Window>
  );
}

type ItemProps = {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
};

function FilterItem({ label, count, active, onClick }: ItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-1 px-2 py-[2px] text-left text-[12px]",
        active
          ? "bg-primary text-on-primary"
          : "text-ink hover:bg-primary hover:text-on-primary"
      )}
    >
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "shrink-0 text-[11px]",
            active
              ? "text-on-primary/70"
              : "text-ink-soft group-hover:text-on-primary/70"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
