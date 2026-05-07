-- ============================================================================
-- 시드 데이터: 11개 추모 서비스
-- 실행 위치: Supabase Dashboard → SQL Editor → New query → Run
--
-- - on conflict (slug) do update 로 멱등 처리
-- - vote_count 는 보존 (사용자 투표가 누적된 경우를 위해)
-- - 4·5·6단계 검증 잔여 데이터도 함께 삭제
-- ============================================================================

-- 검증 잔여 row 정리
delete from public.services where slug in (
  '__rpc_verify__',
  '__form_test_1__',
  '__test_smoke__'
);

-- 11개 서비스 시드
insert into public.services
  (name, slug, category, start_year, end_year, description, vote_count)
values
  ('싸이월드',   'cyworld',     'SNS',      1999, 2019, '국민 SNS의 전설. 미니홈피, 도토리, 일촌, BGM의 추억이 깃든 한국 최초의 본격 소셜 네트워크.', 0),
  ('미투데이',   'me2day',      'SNS',      2007, 2014, '네이버판 트위터. 연예인들도 활발히 사용하던 단문 SNS의 추억.', 0),
  ('이글루스',   'egloos',      'SNS',      2003, 2023, '감성 블로그 문화의 상징. 서브컬처 커뮤니티의 성지였던 그 시절.', 0),
  ('네이트온',   'nateon',      '메신저',    2002, 2022, '카카오톡 이전 국민 메신저. 쪽지, 멀티채팅, 감정표현으로 회사·학교를 잇던 그 시절.', 0),
  ('버디버디',   'buddybuddy',  '메신저',    1999, 2014, '네이트온 이전 세대의 국민 메신저. 학교 끝나면 바로 접속하던 그 시절.', 0),
  ('마이피플',   'mypeople',    '메신저',    2010, 2015, '카카오톡 초기 최대 경쟁자. 다음카카오 합병 후 조용히 사라진 메신저.', 0),
  ('세이클럽',   'sayclub',     '커뮤니티',  1999, 2019, '아바타 꾸미기와 채팅방 문화의 원조. 한국 인터넷 유료 아이템의 시초.', 0),
  ('프리챌',     'freechal',    '커뮤니티',  1999, 2013, '싸이월드 이전 커뮤니티 강자. 유료화 정책 한 방으로 몰락한 비운의 서비스.', 0),
  ('다음 카페',  'daum-cafe',   '커뮤니티',  1999, null, '팬카페, 동호회, 학교 커뮤니티 문화의 본거지. 지금도 살아있는 한국 커뮤니티의 뿌리.', 0),
  ('소리바다',   'soribada',    '음악영상',  2000, null, '한국 최초 P2P 음악 공유 서비스. 저작권 논란의 역사가 그대로 담긴 산증인.', 0),
  ('판도라TV',   'pandora-tv',  '음악영상',  2004, 2020, '유튜브 이전 UCC 문화를 이끈 한국 동영상 플랫폼의 원조.', 0)
on conflict (slug) do update set
  name        = excluded.name,
  category    = excluded.category,
  start_year  = excluded.start_year,
  end_year    = excluded.end_year,
  description = excluded.description;

-- 결과 확인용 select (SQL Editor에 결과 표시)
select count(*) as total_services from public.services;
