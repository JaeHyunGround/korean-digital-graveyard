import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "한국 디지털 묘지 — 추억의 인터넷 서비스 아카이브",
  description:
    "싸이월드, 네이트온, 미투데이… 한국인의 추억이 잠든 디지털 묘지. 사라진 인터넷 서비스를 기억하고 추억을 남기는 공간입니다.",
};

// iOS notch / 카카오톡 인앱 브라우저 등에서 safe-area 인식되도록.
// interactiveWidget: 'resizes-content' — 키보드 열릴 때 layout viewport 가
// 줄어들어 input이 키보드에 가려지지 않고 보이도록 함 (Android 인앱 브라우저 대응)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-dvh bg-canvas safe-pad md:h-dvh md:overflow-hidden">
        {children} <Analytics />
      </body>
    </html>
  );
}
