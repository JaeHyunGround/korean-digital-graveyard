import { Suspense } from "react";
import { getSupabase } from "@/lib/supabase";
import { HomeView } from "@/components/home/HomeView";
import type { ServiceWithMemoryCount } from "@/lib/format";
import type { Service } from "@/lib/database.types";
import { Window, WindowBody, TitleBar } from "@/components/ui";

// 30초마다 ISR 재검증 (목록 페이지)
export const revalidate = 30;

type ServiceRowWithEmbed = Service & {
  memories: { count: number }[];
};

async function fetchServices(): Promise<{
  services: ServiceWithMemoryCount[];
  error: string | null;
}> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*, memories(count)")
      .order("vote_count", { ascending: false });

    if (error) return { services: [], error: error.message };

    const services = ((data as unknown as ServiceRowWithEmbed[]) ?? []).map(
      (row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        logo_url: row.logo_url,
        category: row.category,
        start_year: row.start_year,
        end_year: row.end_year,
        description: row.description,
        vote_count: row.vote_count,
        created_at: row.created_at,
        memory_count: row.memories?.[0]?.count ?? 0,
      })
    );

    return { services, error: null };
  } catch (e) {
    return {
      services: [],
      error: e instanceof Error ? e.message : "알 수 없는 오류",
    };
  }
}

export default async function HomePage() {
  const { services, error } = await fetchServices();

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeView services={services} />
    </Suspense>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl md:max-h-[min(80dvh,800px)] md:overflow-y-auto">
      <Window>
        <TitleBar title="⚠️ 오류 — Supabase 연결 실패" />
        <WindowBody>
          <div className="bg-paper bevel-input-2 p-4 text-[13px]">
            <p className="mb-2 font-bold text-critical">데이터를 불러오지 못했습니다.</p>
            <pre className="text-[12px] whitespace-pre-wrap text-ink-muted">{message}</pre>
            <p className="mt-3 text-[12px] text-ink-soft">
              `.env.local` 의 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 가
              설정되었는지, SQL 마이그레이션이 실행되었는지 확인하세요.
            </p>
          </div>
        </WindowBody>
      </Window>
    </div>
  );
}

function HomeFallback() {
  return (
    <div className="mx-auto max-w-6xl">
      <Window>
        <TitleBar title="🪦 한국 디지털 묘지" />
        <WindowBody>
          <div className="p-8 text-center text-[13px] text-ink-muted">
            묘비를 불러오는 중…
          </div>
        </WindowBody>
      </Window>
    </div>
  );
}
