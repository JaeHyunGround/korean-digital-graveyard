"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

const FP_CACHE_KEY = "kdg.fp";
const VOTED_CACHE_KEY = "kdg.voted";

let _promise: Promise<string> | null = null;

/**
 * 브라우저 핑거프린트(visitorId)를 가져온다.
 * - localStorage에 캐시된 값이 있으면 즉시 반환
 * - 없으면 FingerprintJS로 계산 후 캐싱
 * - 동시 호출 시 promise 공유
 */
export function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("getFingerprint은 브라우저에서만 호출 가능"));
  }
  if (_promise) return _promise;

  _promise = (async () => {
    const cached = window.localStorage.getItem(FP_CACHE_KEY);
    if (cached) return cached;

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    window.localStorage.setItem(FP_CACHE_KEY, result.visitorId);
    return result.visitorId;
  })();

  return _promise;
}

/** 이 슬러그에 이미 투표했다고 표시 */
export function markVoted(slug: string): void {
  if (typeof window === "undefined") return;
  const set = readVotedSet();
  set.add(slug);
  window.localStorage.setItem(VOTED_CACHE_KEY, JSON.stringify([...set]));
}

/** 이 슬러그에 이미 투표했는지 (로컬 캐시 기준) */
export function hasVoted(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return readVotedSet().has(slug);
}

function readVotedSet(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VOTED_CACHE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {
    /* 무시 */
  }
  return new Set();
}
