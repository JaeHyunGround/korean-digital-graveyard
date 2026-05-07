/**
 * 서비스명에서 URL slug 생성.
 * - 한글/영문 모두 허용 (URL 인코딩으로 처리됨)
 * - 공백 → 하이픈, 연속 하이픈 압축, 양끝 트리밍
 * - 결과가 비었으면 랜덤 접두어 fallback
 */
export function makeSlug(name: string): string {
  const cleaned = name
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (cleaned) return cleaned;
  return `service-${randomSuffix()}`;
}

export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function withRandomSuffix(slug: string): string {
  return `${slug}-${randomSuffix()}`;
}
