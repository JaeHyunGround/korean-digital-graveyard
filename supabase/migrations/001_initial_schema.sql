-- ============================================================================
-- 한국 디지털 묘지 — 초기 스키마
-- 실행 위치: Supabase Dashboard → SQL Editor → New query → 전체 붙여넣기 → Run
-- ============================================================================

-- ============================================================================
-- 1. services (디지털 묘비)
-- ============================================================================
create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  logo_url     text,
  category     text not null
    check (category in ('SNS', '메신저', '커뮤니티', '게임', '음악영상', '기타')),
  start_year   int  not null check (start_year between 1980 and 2100),
  end_year     int  check (end_year is null or end_year between start_year and 2100),
  description  text not null default '' check (length(description) <= 2000),
  vote_count   int  not null default 0 check (vote_count >= 0),
  created_at   timestamptz not null default now()
);

create index if not exists idx_services_category   on public.services (category);
create index if not exists idx_services_vote_count on public.services (vote_count desc);
create index if not exists idx_services_created_at on public.services (created_at desc);
create index if not exists idx_services_name       on public.services (name);

comment on table  public.services is '추모할 인터넷 서비스(묘비)';
comment on column public.services.end_year is 'NULL이면 운영중';
comment on column public.services.vote_count is '"기억해요" 투표 누적 수 (votes 테이블의 캐시)';

-- ============================================================================
-- 2. memories (추억 댓글)
-- ============================================================================
create table if not exists public.memories (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references public.services(id) on delete cascade,
  author_name  text not null check (length(author_name) between 1 and 30),
  content      text not null check (length(content) between 1 and 500),
  created_at   timestamptz not null default now()
);

create index if not exists idx_memories_service_created
  on public.memories (service_id, created_at desc);

comment on table public.memories is '서비스에 대한 추억(로그인 없이 닉네임만)';

-- ============================================================================
-- 3. votes (투표 기록 - 중복 방지용)
-- ============================================================================
create table if not exists public.votes (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references public.services(id) on delete cascade,
  fingerprint  text not null check (length(fingerprint) between 1 and 100),
  created_at   timestamptz not null default now(),
  unique (service_id, fingerprint)
);

create index if not exists idx_votes_fingerprint on public.votes (fingerprint);

comment on table  public.votes is 'FingerprintJS 기반 익명 투표 기록 (중복방지)';
comment on column public.votes.fingerprint is '브라우저 핑거프린트 — user_id 대용';

-- ============================================================================
-- 4. RPC: vote_for_service — 멱등 투표
--   - 동일 fingerprint가 같은 서비스에 두 번 투표 불가
--   - 성공 시 services.vote_count 증가, success=true 반환
--   - 이미 투표 시 success=false + 현재 vote_count 반환
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
-- OUT 파라미터(success, vote_count)와 컬럼명이 같을 수 있으므로
-- 이름 충돌 시 컬럼을 우선 해석하도록 강제한다.
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

  -- 새 투표 시도. 중복이면 catch.
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

comment on function public.vote_for_service(text, text) is
  '멱등 투표: 동일 fingerprint가 다시 투표하면 success=false, 새 투표면 true.';

-- ============================================================================
-- 5. RLS — 행 단위 보안
--   - services: SELECT 공개, INSERT 공개(누구나 제출), UPDATE 차단(투표는 RPC만)
--   - memories: SELECT/INSERT 공개
--   - votes:    SELECT 공개, INSERT 차단(반드시 RPC 경유)
-- ============================================================================
alter table public.services enable row level security;
alter table public.memories enable row level security;
alter table public.votes    enable row level security;

drop policy if exists "services read"   on public.services;
drop policy if exists "services insert" on public.services;
drop policy if exists "memories read"   on public.memories;
drop policy if exists "memories insert" on public.memories;
drop policy if exists "votes read"      on public.votes;

create policy "services read"
  on public.services for select using (true);

create policy "services insert"
  on public.services for insert with check (
    -- 클라이언트가 vote_count를 0이 아닌 값으로 넣지 못하도록 제약
    vote_count = 0
  );

create policy "memories read"
  on public.memories for select using (true);

create policy "memories insert"
  on public.memories for insert with check (true);

create policy "votes read"
  on public.votes for select using (true);

-- 일부러 votes INSERT 정책을 만들지 않음 → vote_for_service RPC만 통과 가능
