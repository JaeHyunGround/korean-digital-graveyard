import {
  Window,
  WindowBody,
  TitleBar,
  MenuBar,
  StatusBar,
  StatusPanel,
} from "@/components/ui";
import { SubmitForm } from "@/components/submit/SubmitForm";
import Link from "next/link";

export const metadata = {
  title: "묘비 세우기 — 한국 디지털 묘지",
  description: "기억하는 추억의 인터넷 서비스를 디지털 묘지에 등록해주세요.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto h-full max-w-2xl overflow-y-auto">
      <Window>
        <TitleBar title="🪦 묘비 세우기" />
        <MenuBar
          logo={
            <Link href="/" className="hover:underline">
              🪦 디지털 묘지
            </Link>
          }
          items={[
            { label: "← 목록으로", href: "/" },
            { label: "도움말(H)", href: "/about" },
          ]}
        />
        <WindowBody>
          <div className="bg-paper bevel-input-2 p-3">
            <p className="mb-3 text-[12px] leading-[1.6] text-ink-muted">
              사라진(또는 살아남은) 인터넷 서비스를 함께 기억해요.
            </p>
            <SubmitForm />
          </div>
        </WindowBody>
        <StatusBar>
          <StatusPanel>🪦 묘비 세우기</StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}
