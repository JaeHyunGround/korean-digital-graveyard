"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";
import { getFingerprint, hasVoted, markVoted } from "@/lib/fingerprint";

type Props = {
  slug: string;
  initialCount: number;
};

type VoteState = "idle" | "loading" | "voted" | "error";

export function VoteButton({ slug, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [state, setState] = useState<VoteState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fingerprintReady, setFingerprintReady] = useState(false);

  // 마운트 후 핑거프린트 + 로컬 캐시 확인
  useEffect(() => {
    let cancelled = false;
    if (hasVoted(slug)) setState("voted");
    getFingerprint()
      .then(() => {
        if (!cancelled) setFingerprintReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMsg("핑거프린트를 가져올 수 없습니다");
          setState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleClick() {
    if (state === "loading" || state === "voted") return;

    setState("loading");
    setErrorMsg(null);

    try {
      const fingerprint = await getFingerprint();
      const supabase = getSupabase();
      const { data, error } = await supabase.rpc("vote_for_service", {
        p_slug: slug,
        p_fingerprint: fingerprint,
      });

      if (error) {
        setErrorMsg(error.message);
        setState("error");
        return;
      }

      const result = data?.[0];
      if (!result) {
        setErrorMsg("응답이 비어있습니다");
        setState("error");
        return;
      }

      setCount(result.vote_count);
      markVoted(slug);
      setState("voted");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "투표 실패");
      setState("error");
    }
  }

  const disabled = state === "loading" || state === "voted" || !fingerprintReady;
  const label =
    state === "loading"
      ? "전송중…"
      : state === "voted"
      ? "✅ 이미 기억하고 있어요"
      : !fingerprintReady
      ? "준비중…"
      : "🕯️ 나도 기억해요!";

  return (
    <div className="space-y-1">
      <Button block onClick={handleClick} disabled={disabled}>
        {label}{" "}
        <span className="ml-1 font-mono text-[13px]">
          ({count.toLocaleString()})
        </span>
      </Button>
      {errorMsg && (
        <p className="text-[11px] text-critical">⚠ {errorMsg}</p>
      )}
    </div>
  );
}
