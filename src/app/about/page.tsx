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

export const metadata = {
  title: "사이트 소개 — 한국 디지털 묘지",
  description:
    "한국 디지털 묘지는 사라진 추억의 인터넷 서비스를 기억하고 추억을 나누는 커뮤니티 아카이브입니다.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Window>
        <TitleBar title="ℹ️ 사이트 소개" />
        <MenuBar
          logo={
            <Link href="/" className="hover:underline">
              🪦 디지털 묘지
            </Link>
          }
          items={[
            { label: "← 목록으로", href: "/" },
            { label: "🪦 묘비 세우기", href: "/submit" },
          ]}
        />
        <WindowBody>
          <article className="bg-paper bevel-in space-y-3 p-4 text-[13px] leading-[1.7]">
            <h1 className="text-[18px] font-bold text-primary">
              🪦 한국 디지털 묘지
            </h1>
            <p>
              한국인의 추억이 잠든 인터넷 서비스를 함께 기억하는 공간입니다.
              <br />
              싸이월드, 네이트온, 미투데이… 수많은 서비스가 사라졌고, 어떤 서비스는 여전히 살아있습니다. 우리 모두의 디지털 발자취를 잊지 않기 위해 이 묘지를 만들었습니다.
            </p>

            <Divider />

            <h2 className="text-[14px] font-bold text-primary">참여 방법</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>기억하고 있어요</strong> — 서비스 카드 또는 상세 페이지에서 기억해요 버튼을 누르세요.
              </li>
              <li>
                <strong>추억 남기기</strong> — 닉네임만 적으면 누구나 추억을 남길 수 있어요.
              </li>
              <li>
                <strong>묘비 세우기</strong> — 목록에 없는 서비스는{" "}
                <Link href="/submit" className="font-bold text-primary hover:underline">
                  묘비 세우기
                </Link>
                에서 직접 등록해주세요.
              </li>
            </ul>

            <Divider />

            <h2 className="text-[14px] font-bold text-primary">개인정보</h2>
            <p className="text-[12px] text-ink-muted">
              본 사이트는 회원가입을 요구하지 않습니다. 투표 중복 방지를 위해 익명 브라우저 핑거프린트만 사용합니다. 개인을 식별할 수 있는 정보는 수집하지 않습니다.
            </p>
          </article>
        </WindowBody>
        <StatusBar>
          <StatusPanel>ℹ️ 사이트 소개</StatusPanel>
          <StatusPanel className="ml-auto">v0.1</StatusPanel>
        </StatusBar>
      </Window>
    </div>
  );
}
