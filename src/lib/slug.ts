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

/**
 * 서비스명을 정규화해서 중복 비교용 키로 변환.
 * - NFC 정규화 (한글 자모 결합)
 * - 소문자
 * - 모든 공백 / 하이픈 / 점 제거 → "카트 라이더" === "카트라이더" === "Kart Rider"
 *
 * 한글-영문 혼용 ("카트라이더" vs "kartrider")은 잡지 못함.
 */
export function normalizeName(name: string): string {
  return name
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s\-._/]+/g, "");
}
