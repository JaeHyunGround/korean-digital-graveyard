"use client";

import { Select } from "@/components/ui";
import { CATEGORY_EMOJI, type Decade } from "@/lib/format";
import type { ServiceCategory } from "@/lib/database.types";

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

export function MobileFilterBar({
  category,
  decade,
  total,
  categoryCounts,
  decadeCounts,
  onCategoryChange,
  onDecadeChange,
}: Props) {
  return (
    <div className="bevel-in-1 grid grid-cols-2 gap-1.5 bg-surface-muted p-1.5">
      <label className="flex items-center gap-1 text-[12px]">
        <span className="font-bold whitespace-nowrap">📁 카테고리</span>
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="min-w-0 flex-1"
        >
          <option value="전체">📂 전체 ({total})</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_EMOJI[c]} {c} ({categoryCounts[c]})
            </option>
          ))}
        </Select>
      </label>
      <label className="flex items-center gap-1 text-[12px]">
        <span className="font-bold whitespace-nowrap">⏱ 연대</span>
        <Select
          value={decade}
          onChange={(e) => onDecadeChange(e.target.value)}
          className="min-w-0 flex-1"
        >
          <option value="all">📅 전체</option>
          <option value="1990">1990년대 ({decadeCounts["1990"]})</option>
          <option value="2000">2000년대 ({decadeCounts["2000"]})</option>
          <option value="2010">2010년대 ({decadeCounts["2010"]})</option>
        </Select>
      </label>
    </div>
  );
}
