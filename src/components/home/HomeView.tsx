"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Window,
  WindowBody,
  TitleBar,
  MenuBar,
  StatusBar,
  StatusPanel,
} from "@/components/ui";
import { ServiceCard } from "./ServiceCard";
import { FilterSidebar } from "./FilterSidebar";
import { MobileFilterBar } from "./MobileFilterBar";
import { SortBar, type SortKey } from "./SortBar";
import { getDecade, type ServiceWithMemoryCount, type Decade } from "@/lib/format";
import type { ServiceCategory } from "@/lib/database.types";

type Props = {
  services: ServiceWithMemoryCount[];
};

export function HomeView({ services }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get("category") ?? "전체";
  const decade = params.get("decade") ?? "all";
  const sort = (params.get("sort") ?? "vote") as SortKey;

  const setParam = useCallback(
    (key: string, value: string, defaultValue: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === defaultValue) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<ServiceCategory, number> = {
      SNS: 0,
      메신저: 0,
      커뮤니티: 0,
      게임: 0,
      음악영상: 0,
      기타: 0,
    };
    for (const s of services) counts[s.category]++;
    return counts;
  }, [services]);

  const decadeCounts = useMemo(() => {
    const counts: Record<Decade, number> = { "1990": 0, "2000": 0, "2010": 0 };
    for (const s of services) {
      const d = getDecade(s.start_year);
      if (d) counts[d]++;
    }
    return counts;
  }, [services]);

  const filtered = useMemo(() => {
    let list = services.slice();
    if (category !== "전체") list = list.filter((s) => s.category === category);
    if (decade !== "all") list = list.filter((s) => getDecade(s.start_year) === decade);

    if (sort === "vote") list.sort((a, b) => b.vote_count - a.vote_count);
    else if (sort === "memory") list.sort((a, b) => b.memory_count - a.memory_count);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ko"));

    return list;
  }, [services, category, decade, sort]);

  const totalServices = services.length;
  const totalMemories = services.reduce((sum, s) => sum + s.memory_count, 0);
  const ripCount = services.filter((s) => s.end_year !== null).length;

  return (
    <div className="mx-auto max-w-6xl">
      <Window>
        <TitleBar title="🪦 한국 디지털 묘지 — 추억의 인터넷 서비스 아카이브" />
        <MenuBar
          logo={<>🪦 디지털 묘지</>}
          items={[
            { label: "파일(F)" },
            { label: "보기(V)" },
            { label: "🪦 묘비 세우기", href: "/submit" },
            { label: "도움말(H)", href: "/about" },
          ]}
        />
        <WindowBody>
          <div className="flex flex-col gap-2 md:flex-row">
            <aside className="hidden shrink-0 md:block md:w-44">
              <FilterSidebar
                category={category}
                decade={decade}
                total={totalServices}
                categoryCounts={categoryCounts}
                decadeCounts={decadeCounts}
                onCategoryChange={(v) => setParam("category", v, "전체")}
                onDecadeChange={(v) => setParam("decade", v, "all")}
              />
            </aside>
            <div className="md:hidden">
              <MobileFilterBar
                category={category}
                decade={decade}
                total={totalServices}
                categoryCounts={categoryCounts}
                decadeCounts={decadeCounts}
                onCategoryChange={(v) => setParam("category", v, "전체")}
                onDecadeChange={(v) => setParam("decade", v, "all")}
              />
            </div>

            <main className="min-h-[500px] min-w-0 flex-1">
              <SortBar
                sort={sort}
                total={filtered.length}
                onChange={(v) => setParam("sort", v, "vote")}
              />
              {filtered.length === 0 ? (
                <EmptyState
                  hasServices={services.length > 0}
                  onReset={() => router.replace(pathname)}
                />
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </WindowBody>
        <StatusBar>
          <StatusPanel>📂 {totalServices}개 서비스</StatusPanel>
          <StatusPanel>🕯️ 총 추억 {totalMemories.toLocaleString()}개</StatusPanel>
          <StatusPanel>👻 종료된 서비스: {ripCount}개</StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}

function EmptyState({
  hasServices,
  onReset,
}: {
  hasServices: boolean;
  onReset: () => void;
}) {
  return (
    <div className="bg-paper bevel-input-2 mx-auto flex max-w-md flex-col items-center gap-3 p-8 text-center">
      <div className="text-5xl">🪦</div>
      {hasServices ? (
        <>
          <p className="text-[13px]">조건에 맞는 서비스가 없습니다.</p>
          <button
            type="button"
            onClick={onReset}
            className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in cursor-pointer px-3 py-[3px] text-[12px] font-bold text-ink"
          >
            필터 초기화
          </button>
        </>
      ) : (
        <>
          <p className="text-[13px]">아직 안치된 서비스가 없습니다.</p>
          <p className="text-[12px] text-ink-soft">첫 번째 묘비를 세워주세요.</p>
          <Link
            href="/submit"
            className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in cursor-pointer px-3 py-[3px] text-[12px] font-bold text-ink"
          >
            🪦 묘비 세우기
          </Link>
        </>
      )}
    </div>
  );
}
