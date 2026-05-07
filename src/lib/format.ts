import type { ServiceCategory } from "./database.types";

export type Decade = "1990" | "2000" | "2010";
export const DECADES: Decade[] = ["1990", "2000", "2010"];

/** start_year를 기준으로 연대(1990/2000/2010)를 반환. 그 외는 null */
export function getDecade(year: number): Decade | null {
  if (year >= 1990 && year < 2000) return "1990";
  if (year >= 2000 && year < 2010) return "2000";
  if (year >= 2010 && year < 2020) return "2010";
  return null;
}

export function formatYears(start: number, end: number | null): string {
  return end ? `${start} — ${end}` : `${start} — 현재`;
}

export const CATEGORY_EMOJI: Record<ServiceCategory, string> = {
  SNS: "🌐",
  메신저: "💬",
  커뮤니티: "🏘️",
  게임: "🎮",
  음악영상: "🎵",
  기타: "📁",
};

/** ISO 타임스탬프를 한글 상대 시간으로 변환 */
export function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const sec = Math.floor((now - t) / 1000);
  if (sec < 60) return "방금";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}주 전`;
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export type ServiceWithMemoryCount = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  category: ServiceCategory;
  start_year: number;
  end_year: number | null;
  description: string;
  vote_count: number;
  created_at: string;
  memory_count: number;
};
