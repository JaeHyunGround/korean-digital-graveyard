"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "./supabase";

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
