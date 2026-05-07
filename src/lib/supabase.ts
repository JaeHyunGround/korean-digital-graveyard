import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * 본 프로젝트는 인증이 없으므로 anon key 단일 클라이언트만 사용한다.
 * 서버/클라이언트 양쪽에서 동일하게 import 가능.
 *
 * env 누락 시 첫 호출 시점에 에러를 던지므로, env 미설정 상태에서도
 * 앱 빌드 자체는 통과한다.
 */

let _client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "환경변수 누락: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 .env.local 에 설정하세요."
    );
  }

  _client = createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
