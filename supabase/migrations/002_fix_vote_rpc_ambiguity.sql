-- ============================================================================
-- 핫픽스: vote_for_service RPC의 OUT 파라미터(vote_count)와
--         services.vote_count 컬럼명 충돌 해결.
-- 실행 위치: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

create or replace function public.vote_for_service(
  p_slug        text,
  p_fingerprint text
)
returns table (success boolean, vote_count int)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_service_id uuid;
  v_count int;
begin
  if p_slug is null or length(p_slug) = 0 then
    raise exception 'slug is required';
  end if;
  if p_fingerprint is null or length(p_fingerprint) = 0 then
    raise exception 'fingerprint is required';
  end if;

  select id into v_service_id from public.services where slug = p_slug;
  if v_service_id is null then
    raise exception 'service not found: %', p_slug using errcode = 'P0002';
  end if;

  begin
    insert into public.votes (service_id, fingerprint)
    values (v_service_id, p_fingerprint);
  exception when unique_violation then
    select s.vote_count into v_count from public.services s where s.id = v_service_id;
    return query select false, v_count;
    return;
  end;

  update public.services
     set vote_count = vote_count + 1
   where id = v_service_id
   returning services.vote_count into v_count;

  return query select true, v_count;
end;
$$;

grant execute on function public.vote_for_service(text, text) to anon, authenticated;

-- 4단계 검증 중 삽입된 임시 테스트 row 정리.
-- (RLS 미적용 슈퍼유저로 실행되는 SQL Editor에서만 실행 가능)
delete from public.services where slug = '__test_smoke__';
