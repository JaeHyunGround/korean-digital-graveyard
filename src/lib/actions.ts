"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "./supabase";
import { makeSlug, normalizeName, withRandomSuffix } from "./slug";
import type { ServiceCategory } from "./database.types";

type VoteSuccess = {
  ok: true;
  /** RPC 가 새 투표로 처리했으면 true, 이미 투표한 fingerprint 였으면 false */
  newVote: boolean;
  voteCount: number;
};

type VoteFailure = {
  ok: false;
  errorMessage: string;
};

export async function voteForServiceAction(
  slug: string,
  fingerprint: string
): Promise<VoteSuccess | VoteFailure> {
  if (!slug || !fingerprint) {
    return { ok: false, errorMessage: "잘못된 요청입니다." };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("vote_for_service", {
    p_slug: slug,
    p_fingerprint: fingerprint,
  });

  if (error) {
    return { ok: false, errorMessage: error.message };
  }

  const row = data?.[0];
  if (!row) {
    return { ok: false, errorMessage: "응답이 비어있습니다." };
  }

  // 새 투표면 ISR 캐시 무효화 (홈 + 해당 서비스 상세)
  if (row.success) {
    revalidatePath("/");
    revalidatePath(`/services/${slug}`);
  }

  return {
    ok: true,
    newVote: row.success,
    voteCount: row.vote_count,
  };
}

// ============================================================================
// submitServiceAction — 새 묘비 등록
// ============================================================================

export type SubmitServiceInput = {
  name: string;
  category: ServiceCategory;
  startYear: number;
  endYear: number | null;
  description: string;
};

type SubmitSuccess = {
  ok: true;
  slug: string;
};

type SubmitFailure = {
  ok: false;
  errorMessage: string;
  /** 정규화된 이름이 같은 기존 묘비를 찾았을 때 채워짐 */
  duplicate?: { name: string; slug: string };
};

export async function submitServiceAction(
  input: SubmitServiceInput
): Promise<SubmitSuccess | SubmitFailure> {
  const trimmedName = input.name.trim();
  const trimmedDescription = input.description.trim();

  if (!trimmedName) {
    return { ok: false, errorMessage: "서비스명을 입력해주세요." };
  }

  const supabase = getSupabase();

  // 1) 사전 중복 검사 (정규화 비교)
  const targetKey = normalizeName(trimmedName);
  const { data: existing, error: existingErr } = await supabase
    .from("services")
    .select("name, slug");
  if (existingErr) {
    return { ok: false, errorMessage: existingErr.message };
  }
  const dup = existing?.find((s) => normalizeName(s.name) === targetKey);
  if (dup) {
    return {
      ok: false,
      errorMessage: `"${dup.name}" 은(는) 이미 안치되어 있어요. 같은 묘비에 추억을 남겨주세요.`,
      duplicate: dup,
    };
  }

  // 2) INSERT (slug 충돌 시 접미어 붙여 최대 3회 재시도)
  const baseSlug = makeSlug(trimmedName);
  let slugToUse = baseSlug;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error: insertErr } = await supabase
      .from("services")
      .insert({
        name: trimmedName,
        slug: slugToUse,
        category: input.category,
        start_year: input.startYear,
        end_year: input.endYear,
        description: trimmedDescription,
        vote_count: 0,
      })
      .select("slug")
      .single();

    if (!insertErr && data) {
      // 새 묘비 등록 성공 → 홈 ISR 캐시 즉시 무효화
      revalidatePath("/");
      return { ok: true, slug: data.slug };
    }

    if (insertErr?.code === "23505") {
      slugToUse = withRandomSuffix(baseSlug);
      continue;
    }

    return {
      ok: false,
      errorMessage: insertErr?.message ?? "알 수 없는 오류가 발생했습니다.",
    };
  }

  return {
    ok: false,
    errorMessage: "같은 이름의 서비스가 이미 너무 많습니다. 다른 이름을 사용해주세요.",
  };
}
