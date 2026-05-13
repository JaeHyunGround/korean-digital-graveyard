import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Window,
  WindowBody,
  TitleBar,
  MenuBar,
  StatusBar,
  StatusPanel,
  CornerBadge,
  Divider,
} from "@/components/ui";
import { VoteButton } from "@/components/service/VoteButton";
import { MemoryList } from "@/components/service/MemoryList";
import { MemoryForm } from "@/components/service/MemoryForm";
import { getSupabase } from "@/lib/supabase";
import { CATEGORY_EMOJI, formatYears } from "@/lib/format";
import type { Service, Memory } from "@/lib/database.types";

export const revalidate = 30;

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Next.js 16 (Turbopack)은 dynamic segment 의 non-ASCII 문자를
 * 자동 디코딩하지 않으므로 여기서 명시적으로 처리한다.
 * NFC 정규화는 makeSlug() 와 양쪽을 통일하기 위함.
 */
function decodeSlug(raw: string): string {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* 잘못된 percent encoding이면 raw 그대로 사용 */
  }
  return decoded.normalize("NFC");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const supabase = getSupabase();
  const { data } = await supabase
    .from("services")
    .select("name, description")
    .eq("slug", slug)
    .maybeSingle();
  const row = data as { name: string; description: string } | null;
  if (!row) return { title: "서비스를 찾을 수 없습니다 — 한국 디지털 묘지" };
  return {
    title: `${row.name} — 한국 디지털 묘지`,
    description: row.description || `${row.name}에 대한 추억을 함께 나누어요.`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const supabase = getSupabase();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (serviceError) {
    return <ErrorBox message={serviceError.message} />;
  }
  if (!service) {
    notFound();
  }

  const { data: memoriesData, error: memoriesError } = await supabase
    .from("memories")
    .select("*")
    .eq("service_id", service.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (memoriesError) {
    return <ErrorBox message={memoriesError.message} />;
  }

  const memories = (memoriesData ?? []) as Memory[];
  const isAlive = service.end_year === null;
  const icon = service.logo_url || CATEGORY_EMOJI[service.category];

  return (
    <div className="mx-auto max-w-5xl">
      <Window>
        <TitleBar
          title={
            <>
              {icon} {service.name} — 상세 정보
            </>
          }
        />
        <MenuBar
          logo={
            <Link href="/" className="hover:underline">
              🪦 디지털 묘지
            </Link>
          }
          items={[
            { label: "← 목록으로", href: "/" },
            { label: "🪦 묘비 세우기", href: "/submit" },
            { label: "도움말(H)", href: "/about" },
          ]}
        />
        <WindowBody>
          <ServiceDetailBody
            service={service as Service}
            memories={memories}
            isAlive={isAlive}
            icon={icon}
          />
        </WindowBody>
        <StatusBar>
          <StatusPanel>
            🕯️ 기억해요 {service.vote_count.toLocaleString()}
          </StatusPanel>
          <StatusPanel>
            💬 추억 {memories.length.toLocaleString()}개
          </StatusPanel>
          <StatusPanel className="ml-auto">
            {isAlive ? "운영중" : "안치 완료"}
          </StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}

function ServiceDetailBody({
  service,
  memories,
  isAlive,
  icon,
}: {
  service: Service;
  memories: Memory[];
  isAlive: boolean;
  icon: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_280px]">
      {/* 좌측 - 정보 */}
      <section className="bg-paper bevel-input-2 relative p-3">
        <CornerBadge variant={isAlive ? "alive" : "rip"} />
        <header className="mb-2 flex items-center gap-2 pr-12">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-bevel-dark bg-surface text-2xl">
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-bold text-primary">
              {service.name}
            </h1>
            <p className="font-mono text-[12px] text-ink-soft">
              {formatYears(service.start_year, service.end_year)}
            </p>
          </div>
        </header>

        <Divider className="my-2" />

        <dl className="grid grid-cols-[80px_1fr] gap-y-1 text-[12px]">
          <dt className="text-ink-soft">서비스명</dt>
          <dd className="font-bold">{service.name}</dd>
          <dt className="text-ink-soft">카테고리</dt>
          <dd className="font-bold">
            {CATEGORY_EMOJI[service.category]} {service.category}
          </dd>
          <dt className="text-ink-soft">운영기간</dt>
          <dd className="font-bold">
            {service.start_year}년 ~{" "}
            {service.end_year ? `${service.end_year}년` : "현재"}
            {!isAlive && service.end_year && (
              <span className="ml-1 text-ink-soft">
                ({service.end_year - service.start_year}년간)
              </span>
            )}
          </dd>
          <dt className="text-ink-soft">상태</dt>
          <dd>
            {isAlive ? (
              <span className="text-success font-bold">운영중</span>
            ) : (
              <span className="text-critical font-bold">종료됨 (R.I.P)</span>
            )}
          </dd>
        </dl>

        <Divider className="my-2" />

        <h2 className="mb-1 text-[12px] font-bold text-primary">📖 설명</h2>
        <p className="whitespace-pre-wrap text-[13px] leading-[1.6] text-ink">
          {service.description ||
            "비문 없이 잠든 묘비입니다. 댓글로 그 시절 추억을 함께 나눠주세요."}
        </p>
      </section>

      {/* 우측 - 투표 + 추억 */}
      <aside className="space-y-2">
        <div className="bg-paper bevel-input-2 p-2">
          <h2 className="mb-1.5 text-[12px] font-bold text-primary">
            🕯️ 이 서비스를 기억하시나요?
          </h2>
          <VoteButton slug={service.slug} initialCount={service.vote_count} />
        </div>

        <div className="bg-paper bevel-input-2 p-2">
          <h2 className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-primary">
            <span>💬 추억</span>
            <span className="font-mono text-[11px] text-ink-soft">
              {memories.length}
            </span>
          </h2>
          <MemoryList memories={memories} />
        </div>

        <div className="bg-paper bevel-input-2 p-2">
          <h2 className="mb-1.5 text-[12px] font-bold text-primary">
            📝 추억 남기기
          </h2>
          <MemoryForm serviceId={service.id} serviceSlug={service.slug} />
        </div>
      </aside>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl md:max-h-[min(80dvh,800px)] md:overflow-y-auto">
      <Window>
        <TitleBar title="⚠️ 오류" />
        <WindowBody>
          <div className="bg-paper bevel-input-2 p-4 text-[13px]">
            <p className="mb-2 font-bold text-critical">
              데이터를 불러오지 못했습니다.
            </p>
            <pre className="whitespace-pre-wrap text-[12px] text-ink-muted">
              {message}
            </pre>
            <Link
              href="/"
              className="mt-3 inline-block text-[12px] font-bold text-primary hover:underline"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </WindowBody>
      </Window>
    </div>
  );
}
