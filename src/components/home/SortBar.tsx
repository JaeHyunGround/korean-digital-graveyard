"use client";

import { Select } from "@/components/ui";

export type SortKey = "vote" | "memory" | "name";

type Props = {
  sort: SortKey;
  total: number;
  onChange: (sort: SortKey) => void;
};

export function SortBar({ sort, total, onChange }: Props) {
  return (
    <div className="bevel-in-1 mb-2 flex flex-wrap items-center gap-2 bg-surface-muted px-2 py-1 text-[12px]">
      <label htmlFor="sort" className="font-bold">
        정렬:
      </label>
      <Select
        id="sort"
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        <option value="vote">기억해요 순</option>
        <option value="memory">추억 많은 순</option>
        <option value="name">가나다순</option>
      </Select>
      <span className="ml-auto text-ink-muted">
        총 <strong className="text-ink">{total}</strong>개 서비스 안치됨
      </span>
    </div>
  );
}
