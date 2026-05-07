import Link from "next/link";
import { Window, WindowBody, TitleBar } from "@/components/ui";

export default function ServiceNotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <Window>
        <TitleBar title="❓ 묘지를 찾을 수 없습니다" />
        <WindowBody>
          <div className="bg-paper bevel-in flex flex-col items-center gap-3 p-6 text-center">
            <div className="text-5xl">🪦</div>
            <p className="text-[13px] font-bold">
              해당 서비스의 묘비를 찾을 수 없습니다.
            </p>
            <p className="text-[12px] text-ink-soft">
              주소가 잘못되었거나 아직 안치되지 않은 서비스일 수 있어요.
            </p>
            <div className="flex gap-2">
              <Link
                href="/"
                className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in cursor-pointer px-3 py-[3px] text-[12px] font-bold text-ink"
              >
                ← 목록으로
              </Link>
              <Link
                href="/submit"
                className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in cursor-pointer px-3 py-[3px] text-[12px] font-bold text-ink"
              >
                + 새 서비스 제출하기
              </Link>
            </div>
          </div>
        </WindowBody>
      </Window>
    </div>
  );
}
