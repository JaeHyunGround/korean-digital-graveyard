import Link from "next/link";
import {
  Window,
  WindowBody,
  TitleBar,
  MenuBar,
  StatusBar,
  StatusPanel,
  Divider,
} from "@/components/ui";

export default function ServiceDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      <Window>
        <TitleBar title="🪦 묘비를 불러오는 중…" />
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
        <WindowBody className="space-y-3">
          {/* 흐르는 진행률 바 */}
          <ProgressBar />

          {/* 스켈레톤 — 실제 페이지 레이아웃과 동일하게 */}
          <div className="grid gap-3 md:grid-cols-[1fr_280px]">
            {/* 좌측 정보 영역 */}
            <section className="bg-paper bevel-input-2 space-y-2 p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-12 w-12 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <Divider className="my-2" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
              <Divider className="my-2" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </section>

            {/* 우측 패널 3개 */}
            <aside className="space-y-2">
              <SkeletonPanel height="h-20" />
              <SkeletonPanel height="h-40" />
              <SkeletonPanel height="h-44" />
            </aside>
          </div>
        </WindowBody>
        <StatusBar>
          <StatusPanel>⏳ 불러오는 중…</StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="mx-auto max-w-md">
      <div className="bevel-input relative h-4 overflow-hidden bg-surface">
        <div className="bg-progress-stripes animate-win98-stripes absolute inset-0" />
      </div>
      <p className="mt-1 text-center text-[11px] text-ink-muted">
        묘비를 발굴하고 있어요…
      </p>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-surface-muted animate-pulse ${className ?? ""}`}
      aria-hidden
    />
  );
}

function SkeletonPanel({ height }: { height: string }) {
  return (
    <div className={`bg-paper bevel-input-2 p-2 ${height}`}>
      <Skeleton className="h-3 w-1/2" />
      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
