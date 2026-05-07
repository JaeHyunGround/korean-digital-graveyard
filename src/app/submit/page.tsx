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
  title: "서비스 제출 — 한국 디지털 묘지",
  description: "기억하는 추억의 인터넷 서비스를 디지털 묘지에 등록해주세요.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Window>
        <TitleBar title="🪦 새 서비스 제출 — 묘비 세우기" />
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
          <div className="bg-paper bevel-in p-3">
            <p className="mb-3 text-[12px] leading-[1.6] text-ink-muted">
              사라진(또는 살아남은) 인터넷 서비스를 함께 기억해요.
              <br />
              로그인 없이 누구나 자유롭게 제출 가능합니다.
            </p>
            <SubmitForm />
          </div>
        </WindowBody>
        <StatusBar>
          <StatusPanel>📝 새 서비스 제출 폼</StatusPanel>
          <StatusPanel className="ml-auto">로그인 불필요</StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}
