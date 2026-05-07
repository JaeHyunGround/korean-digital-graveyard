import Link from "next/link";
import { CornerBadge } from "@/components/ui";
import {
  CATEGORY_EMOJI,
  formatYears,
  type ServiceWithMemoryCount,
} from "@/lib/format";

type Props = {
  service: ServiceWithMemoryCount;
};

export function ServiceCard({ service }: Props) {
  const isAlive = service.end_year === null;
  const icon = service.logo_url || CATEGORY_EMOJI[service.category];

  return (
    <Link
      href={`/services/${service.slug}`}
      className="bg-paper bevel-input-2 hover:bevel-out relative block p-2 transition-colors hover:bg-surface-muted"
    >
      <CornerBadge variant={isAlive ? "alive" : "rip"} />
      <header className="mb-1.5 flex items-center gap-1.5 pr-12">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-bevel-dark bg-surface text-base">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-primary">
            {service.name}
          </div>
          <div className="font-mono text-[11px] text-ink-soft">
            {formatYears(service.start_year, service.end_year)}
          </div>
        </div>
      </header>
      <p className="line-clamp-2 min-h-[28px] border-t border-surface pt-1 text-[11px] leading-[1.4] text-ink-muted">
        {service.description || "설명이 아직 등록되지 않았습니다."}
      </p>
      <footer className="mt-1.5 flex items-center justify-between">
        <span className="text-[11px] text-ink-soft">
          💬 {service.memory_count.toLocaleString()}개의 추억
        </span>
        <span className="bg-surface bevel-out-1 inline-flex items-center gap-1 px-1.5 py-[1px] text-[11px] font-bold text-ink">
          🕯️ {service.vote_count.toLocaleString()}
        </span>
      </footer>
    </Link>
  );
}
