"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { voteForServiceAction } from "@/lib/actions";
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

  // 마운트 후 핑거프린트 + 로컬 캐시 확인.
  // 동기 setState 가 effect body에서 일어나면 React 19 Strict Mode가
  // cascading render 경고를 띄우므로, 캐시 체크 결과의 setState 는
  // microtask 로 지연해 effect body 밖에서 실행되도록 한다.
  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled && hasVoted(slug)) setState("voted");
    });

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
      const result = await voteForServiceAction(slug, fingerprint);

      if (!result.ok) {
        setErrorMsg(result.errorMessage);
        setState("error");
        return;
      }

      setCount(result.voteCount);
      markVoted(slug);
      setState("voted");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "투표 실패");
      setState("error");
    }
  }

  const disabled =
    state === "loading" || state === "voted" || !fingerprintReady;
  const label =
    state === "loading"
      ? "기억하는 중…"
      : state === "voted"
        ? "✅ 기억하고 있어요"
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
      {errorMsg && <p className="text-[11px] text-critical">⚠ {errorMsg}</p>}
    </div>
  );
}
