import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "한국 디지털 묘지 — 추억의 인터넷 서비스 아카이브",
  description:
    "싸이월드, 네이트온, 미투데이… 한국인의 추억이 잠든 디지털 묘지. 사라진 인터넷 서비스를 기억하고 추억을 남기는 공간입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-screen bg-canvas p-2 md:p-3">{children}</body>
    </html>
  );
}
