import type { Memory } from "@/lib/database.types";
import { formatTimeAgo } from "@/lib/format";

type Props = {
  memories: Memory[];
};

export function MemoryList({ memories }: Props) {
  if (memories.length === 0) {
    return (
      <div className="bg-paper bevel-input px-2 py-3 text-center text-[12px] text-ink-soft">
        아직 추억이 없습니다. 첫 추억을 남겨보세요.
      </div>
    );
  }

  return (
    <ul className="bg-paper bevel-input max-h-72 overflow-y-auto divide-y divide-dotted divide-bevel-dark/40">
      {memories.map((m) => (
        <li key={m.id} className="px-2 py-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="truncate font-bold text-primary text-[12px]">
              {m.author_name}
            </span>
            <span className="ml-auto shrink-0 text-[11px] text-ink-soft">
              {formatTimeAgo(m.created_at)}
            </span>
          </div>
          <p className="mt-0.5 whitespace-pre-wrap text-[12px] leading-[1.5] text-ink-muted">
            {m.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
